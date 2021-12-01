using OWLOSAirQuality.OWLOSEcosystemService;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Drawing;
using System.Windows.Threading;
using Point = System.Windows.Point;
using OWLOSAirQuality.Huds;
using OWLOSAirQuality.Frames;

namespace OWLOSAirQuality
{
    public partial class EcosystemManagerWindow : Window
    {
        protected OWLOSEcosystemManager EcosystemManager;


        /// <summary>
        /// Width and Height of cell
        /// Размер сетки 
        /// </summary>
        private const int cellSize = 10000;

        /// <summary>
        /// Шаг сетки
        /// </summary>
        private const int cellStep = 25;

        //  UIColors colorChema = new UIColors();

        /// <summary>
        /// Cell zoom factor (mouse while zoom)
        /// Шаг зума
        /// </summary>
        public double zoomFactor = 5.4f;

        /// <summary>
        /// Текущий уровень зума
        /// Также определяет - рисовать или нет мелкие координатные линии, в зависемости от текущего зум - если масштаб мелкий 
        /// линии не рисуются - много мелких линий зашумляет окно
        /// </summary>
        private double currentZoom = 10.0f;

        /// <summary>
        /// Перетаскивания сетки мышью - для запоминания координат клика
        /// </summary>
        private System.Windows.Point downPoint;

        /// <summary>
        /// Смещения при перетаскивании сетки 
        /// </summary>
        private double hOffset, vOffset;


        /// <summary>
        /// Последняя точка перехода
        /// </summary>
        private Point lastPoint;

        /// <summary>
        /// Для тестов ноды 
        /// </summary>
        public EcosystemManagerChildControl ThingsManagerControl;

        public EcosystemManagerWindow()
        {
            InitializeComponent();
            this.EcosystemManager = App.EcosystemManager;

            /*
            Icon = Icons.GetIcon(1815);

            zoomToOneHImage.Source = Icons.GetIcon(491);
            zoomToFullImage.Source = Icons.GetIcon(492);
            autoScrollImage.Source = Icons.GetIcon(1502);
            drawCellImage.Source = Icons.GetIcon(1536);
            perspectiveViewImage.Source = Icons.GetIcon(65);
            iconsViewImage.Source = Icons.GetIcon(327);
            transparentViewImage.Source = Icons.GetIcon(463);
            duplicateWindowImage.Source = Icons.GetIcon(1263);

            //Временно для теста нод ----------
            ThingsManager ThingsManager = new ThingsManager();
            ThingsManagerControl = new EcosystemControl(null);
            ThingGrid.Children.Add(ThingsManagerControl);

            ThingsManager.OnNewThing += ThingsManager_NewOWLOSThing;
            ThingsManager.Load();
            //END OF Временно для теста нод ---
            */

            //Настраиваем разметы элементы в зависимости от выбраного размера сетки
            ThingGrid.Width = ThingGrid.Height = cellSize;
            viewbox.Width = viewbox.Height = cellSize / 10;

            autoScrollImage.Tag = 0;
            drawCellImage.Tag = 1;

            //Рисуем сетку 
            Dispatcher.BeginInvoke((Action)DrawCell, DispatcherPriority.Send);

            ThingsManagerControl = new EcosystemManagerChildControl();
            ThingGrid.Children.Add(ThingsManagerControl.parentControl);

            ValueFrame valueFrame = new ValueFrame(EcosystemManager.OWLOSEcosystemServiceClients[0]);
            valueFrame.MainGrid.Children.Remove(valueFrame.ValueHolderGrid);
            valueFrame.Close();
            ThingsManagerControl.MainGrid.Children.Add(valueFrame.ValueHolderGrid);


            ThingsManagerControl = new EcosystemManagerChildControl();
            ThingGrid.Children.Add(ThingsManagerControl.parentControl);

            valueFrame = new ValueFrame(EcosystemManager.OWLOSEcosystemServiceClients[1]);
            valueFrame.MainGrid.Children.Remove(valueFrame.ValueHolderGrid);
            valueFrame.Close();
            ThingsManagerControl.MainGrid.Children.Add(valueFrame.ValueHolderGrid);

        }

        /*
        private void button1_Click(object sender, RoutedEventArgs e)
        {
            new SingleAirQualityMainWindow(EcosystemManager.OWLOSEcosystemServiceClients[0]).Show();
        }

        private void button2_Click(object sender, RoutedEventArgs e)
        {
            new SingleAirQualityMainWindow(EcosystemManager.OWLOSEcosystemServiceClients[1]).Show();
        }
        */

        private void CloseTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            Close();
        }

        private void MNTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (WindowState == WindowState.Maximized)
            {
                WindowState = WindowState.Normal;
            }
            else
            {
                WindowState = WindowState.Maximized;
            }
        }

        private void HideTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (WindowState != WindowState.Minimized)
            {
                WindowState = WindowState.Minimized;
            }
            else
            {
                WindowState = WindowState.Maximized;
            }
        }

        private void Grid_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (e.ClickCount == 2)
            {
                MNTextBlock_MouseDown(null, null);
            }
        }

        private void TransparentTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if ((sender as TextBlock).Tag == null)
            {
                (sender as TextBlock).Tag = true;
                GeneralGrid.Background = (SolidColorBrush)App.Current.Resources["OWLOSDarkAlpha2"];
            }
            else
            {
                (sender as TextBlock).Tag = null;
                GeneralGrid.Background = (SolidColorBrush)App.Current.Resources["OWLOSDark"];
            }
        }

        private void GeneralGrid_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            DragMove();
        }

        private void Grid_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            try
            {
                DragMove();
            }
            catch { }
        }

        private void TransparentTextBlock_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha3"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void TransparentTextBlock_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        private void HideTextBlock_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha3"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void HideTextBlock_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        private void CloseTextBlock_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha3"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void CloseTextBlock_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        private void TopMostTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            Topmost = !Topmost;
        }

        /// <summary>
        /// Настраиваем начальный зум и позицию пользователя в сетке (можно сделать после загрузки всех компонентов окна, поэтому вынесено из конструктора EcosystemManagerWindow())
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            zoomTextBox.Text = (currentZoom).ToString(("F"));

            Point point = new Point(EcosystemExplorerGrid.ActualWidth / 2.0f, -EcosystemExplorerGrid.ActualHeight / 2.0f);
            Zoom(point);
            viewbox.UpdateLayout();
            MoveWorld(point);
        }


        #region DrawCell
        /// <summary>
        /// Drawing cell grid lines (navigation lines)
        /// </summary>
        private void DrawCell()
        {
            /*
             * Ниже начинаеться процесс отрисовки линии
             * Данное решение позволяет отрисовать линии (практически) без потери производительности приложения
             * На момент запуска приложение использовано общее 200мб и 430мб после загрузки мира
             */
            const int bitmapSize = 2000;
            const int bitmapLength = cellSize / bitmapSize;
            const int posCenter = (bitmapLength / 2);
            System.Drawing.Rectangle size = new System.Drawing.Rectangle(0, 0, bitmapSize, bitmapSize);
            //Выделяем место для наших линий дабы потом их отрендерить в UI
            BitmapSource bsSmallBlack, bsBlackRed, bsBlackGreenHorizontal, bsBlackGreenVertical, bsBlackGreenCenter;

            //Подготавливаем колажи где будут нарисованы наши линии
            using (Bitmap blackBitmap = new Bitmap(bitmapSize, bitmapSize))
            using (Bitmap smallBlackBitmap = new Bitmap(bitmapSize, bitmapSize))
            using (Bitmap greenBitmapVertical = new Bitmap(bitmapSize, bitmapSize))
            using (Bitmap greenBitmapHorizontal = new Bitmap(bitmapSize, bitmapSize))
            using (Bitmap redBitmap = new Bitmap(bitmapSize, bitmapSize))
            {
                SolidColorBrush mediaColorBrushGreen = (SolidColorBrush)App.Current.Resources["OWLOSSuccessAlpha2"];
                System.Drawing.Color colorGreen = System.Drawing.Color.FromArgb(mediaColorBrushGreen.Color.A,
                                                             mediaColorBrushGreen.Color.R,
                                                             mediaColorBrushGreen.Color.G,
                                                             mediaColorBrushGreen.Color.B);
                SolidColorBrush mediaColorBrushRed = (SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"];
                System.Drawing.Color colorRed = System.Drawing.Color.FromArgb(mediaColorBrushRed.Color.A,
                                                             mediaColorBrushRed.Color.R,
                                                             mediaColorBrushRed.Color.G,
                                                             mediaColorBrushRed.Color.B);
                SolidColorBrush mediaColorBrushBlack = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
                System.Drawing.Color colorBlack = System.Drawing.Color.FromArgb(mediaColorBrushBlack.Color.A,
                                                             mediaColorBrushBlack.Color.R,
                                                             mediaColorBrushBlack.Color.G,
                                                             mediaColorBrushBlack.Color.B);
                System.Drawing.Pen penGreen = new System.Drawing.Pen(colorGreen, 6);
                System.Drawing.Pen penRed = new System.Drawing.Pen(colorRed, 6);
                System.Drawing.Pen penBlack = new System.Drawing.Pen(colorBlack, 2);
                System.Drawing.Pen smallPenBlack = new System.Drawing.Pen(colorBlack, .3f);

                //Подготавливаем почву для рисования линий
                using (Graphics gSmallBlack = System.Drawing.Graphics.FromImage(smallBlackBitmap))
                using (Graphics gBlack = System.Drawing.Graphics.FromImage(blackBitmap))
                using (Graphics gRed = System.Drawing.Graphics.FromImage(redBitmap))
                {
                    //Далее сам процесс отрисовки линий и координат
                    for (int linePosition = 0; linePosition < cellSize + cellStep; linePosition += cellStep)
                    {
                        System.Drawing.Pen drawingPen = null;
                        System.Drawing.Graphics graphics = null;
                        if (linePosition % 100 == 0)
                        {
                            TextBlock textBlock = new TextBlock
                            {
                                Text = linePosition.ToString(),
                                Margin = new Thickness(linePosition, 0, 0, 0)
                            };

                            if (linePosition == cellSize / 2)
                            {
                                textBlock.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSSuccess"];

                                drawingPen = penGreen;
                                graphics = gBlack;
                            }
                            else
                            {
                                if (linePosition % 1000 == 0)
                                {
                                    textBlock.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSDanger"];

                                    if (linePosition < bitmapSize)
                                    {
                                        drawingPen = penRed;
                                        graphics = gRed;
                                    }
                                }
                                else
                                {
                                    textBlock.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
                                    if (linePosition < bitmapSize)
                                    {
                                        drawingPen = penBlack;
                                        graphics = gBlack;
                                    }
                                }
                            }

                            textBlock.VerticalAlignment = VerticalAlignment.Center;
                            horisontalNavigationGrid.Children.Add(textBlock);

                            textBlock = new TextBlock
                            {
                                Text = linePosition.ToString(),
                                Margin = new Thickness(0, linePosition, 0, 0)
                            };
                            if (linePosition == cellSize / 2)
                            {

                                textBlock.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSSuccess"];
                            }
                            else
                            if (linePosition % 1000 == 0)
                            {
                                textBlock.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSDanger"];
                            }
                            else
                            {
                                textBlock.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
                            }

                            textBlock.HorizontalAlignment = HorizontalAlignment.Center;
                            verticalNavigationGrid.Children.Add(textBlock);
                        }
                        else
                        if (linePosition < bitmapSize)
                        {
                            drawingPen = smallPenBlack;
                            graphics = gSmallBlack;
                        }

                        if (drawingPen != null)
                        {
                            System.Drawing.Point verticalBegin = new System.Drawing.Point();
                            System.Drawing.Point verticalEnd = new System.Drawing.Point();

                            System.Drawing.Point horizontalBegin = new System.Drawing.Point();
                            System.Drawing.Point horizontalEnd = new System.Drawing.Point();


                            if (drawingPen == penGreen)
                            {
                                //Для зелёных линий отдельно рисуем
                                verticalBegin.X = verticalEnd.X = cellSize / 10;
                                verticalEnd.Y = bitmapSize;
                                horizontalBegin.Y = horizontalEnd.Y = cellSize / 10;
                                horizontalBegin.X = 0;
                                horizontalEnd.X = bitmapSize;

                                using (Graphics gGreenVertical = System.Drawing.Graphics.FromImage(greenBitmapVertical))
                                {
                                    gGreenVertical.DrawLine(drawingPen, verticalBegin, verticalEnd);
                                }

                                using (Graphics gGreenHorizontal = System.Drawing.Graphics.FromImage(greenBitmapHorizontal))
                                {
                                    gGreenHorizontal.DrawLine(drawingPen, horizontalBegin, horizontalEnd);
                                }
                            }
                            else

                            {
                                verticalBegin.X = verticalEnd.X = linePosition;
                                verticalEnd.Y = bitmapSize;
                                horizontalBegin.Y = horizontalEnd.Y = linePosition;
                                horizontalBegin.X = 0;
                                horizontalEnd.X = bitmapSize;

                                graphics.DrawLine(drawingPen, verticalBegin, verticalEnd);
                                graphics.DrawLine(drawingPen, horizontalBegin, horizontalEnd);
                            }
                        }
                    }
                }

                //Переводим из bitmap в bitmapSource
                System.Drawing.Imaging.BitmapData bitmapData = smallBlackBitmap.LockBits(size, System.Drawing.Imaging.ImageLockMode.ReadOnly, smallBlackBitmap.PixelFormat);
                bsSmallBlack = BitmapSource.Create(
                    bitmapData.Width, bitmapData.Height,
                    smallBlackBitmap.HorizontalResolution, smallBlackBitmap.VerticalResolution,
                    PixelFormats.Bgra32, null,
                    bitmapData.Scan0, bitmapData.Stride * bitmapData.Height, bitmapData.Stride);
                smallBlackBitmap.UnlockBits(bitmapData);

                //Делаем тоже самое но, предварительно рисуем их друг на друге (комбинируем/накладываем друг на друга)
                bsBlackRed = CombineBitmaps(size, blackBitmap, redBitmap);
                bsBlackGreenHorizontal = CombineBitmaps(size, blackBitmap, redBitmap, greenBitmapHorizontal);
                bsBlackGreenVertical = CombineBitmaps(size, blackBitmap, redBitmap, greenBitmapVertical);
                bsBlackGreenCenter = CombineBitmaps(size, blackBitmap, redBitmap, greenBitmapHorizontal, greenBitmapVertical);
            }

            //Рендерим уже из буфера
            for (int posY = 0; posY < bitmapLength; posY++)
            {
                //Поповоду virtualizingstackpanel - https://docs.microsoft.com/en-us/dotnet/api/system.windows.controls.virtualizingstackpanel?view=netframework-4.8 - В самому низу Remarks
                //Поле для больших линий
                VirtualizingStackPanel horizontalVirtualStackPanel = new VirtualizingStackPanel
                {
                    Orientation = Orientation.Horizontal
                };
                ThingLines.Children.Add(horizontalVirtualStackPanel);
                //Поле для маленьких линий
                VirtualizingStackPanel smallHorizontalVirtualStackPanel = new VirtualizingStackPanel
                {
                    Orientation = Orientation.Horizontal
                };
                smallThingLines.Children.Add(smallHorizontalVirtualStackPanel);
                for (int posX = 0; posX < bitmapLength; posX++)
                {
                    BitmapSource bitmapSource;
                    //Рисуем в центре
                    if (posX == posCenter && posY == posCenter)
                    {
                        bitmapSource = bsBlackGreenCenter;
                    }
                    else
                    //Вертикаль
                    if (posX == posCenter)
                    {
                        bitmapSource = bsBlackGreenVertical;
                    }
                    else
                    //Горизонталь
                    if (posY == posCenter)
                    {
                        bitmapSource = bsBlackGreenHorizontal;
                    }
                    //Обычная отрисовка в ряд
                    else
                    {
                        bitmapSource = bsBlackRed;
                    }
                    //Создаем UI Image где будем отображать BitmapSource big и small lines
                    System.Windows.Controls.Image image = new System.Windows.Controls.Image
                    {
                        Source = bitmapSource,
                        Width = bitmapSize,
                        Height = bitmapSize,
                        VerticalAlignment = VerticalAlignment.Stretch,
                        HorizontalAlignment = HorizontalAlignment.Stretch

                    };
                    horizontalVirtualStackPanel.Children.Add(image);

                    System.Windows.Controls.Image smallImage = new System.Windows.Controls.Image
                    {
                        Source = bsSmallBlack,
                        Width = bitmapSize,
                        Height = bitmapSize,
                        VerticalAlignment = VerticalAlignment.Stretch,
                        HorizontalAlignment = HorizontalAlignment.Stretch
                    };
                    smallHorizontalVirtualStackPanel.Children.Add(smallImage);
                }
            }

            horisontalNavigationGrid.Visibility = Visibility.Visible;
            verticalNavigationGrid.Visibility = Visibility.Visible;
        }


        private static BitmapSource CombineBitmaps(System.Drawing.Rectangle size, params System.Drawing.Bitmap[] args)
        {

            using (Bitmap bitmap = new System.Drawing.Bitmap(size.Width, size.Height))
            {
                using (Graphics gA = System.Drawing.Graphics.FromImage(bitmap))
                {
                    foreach (Bitmap b in args)
                    {
                        gA.DrawImage(b, size);
                    }
                }
                System.Drawing.Imaging.BitmapData bitmapData = bitmap.LockBits(size, System.Drawing.Imaging.ImageLockMode.ReadOnly, bitmap.PixelFormat);

                BitmapSource bitmapSource = BitmapSource.Create(
                    bitmapData.Width, bitmapData.Height,
                    bitmap.HorizontalResolution, bitmap.VerticalResolution,
                    PixelFormats.Bgra32, null,
                    bitmapData.Scan0, bitmapData.Stride * bitmapData.Height, bitmapData.Stride);
                bitmap.UnlockBits(bitmapData);
                return bitmapSource;
            }
        }
        #endregion

        private void Zoom(System.Windows.Point point)
        {

            double zoom = currentZoom * (cellSize / 100);

            if ((zoom > EcosystemExplorerGrid.ActualWidth / 4) && (zoom > EcosystemExplorerGrid.ActualHeight / 4))
            {
                viewbox.Width = zoom;
                viewbox.Height = zoom;
                viewbox.UpdateLayout();
                MoveWorld(point);
            }
            else
            {
                viewbox.Width = viewbox.Height = EcosystemExplorerGrid.ActualWidth / 4;
            }

            if (currentZoom < 40)
            {
                smallThingLines.Visibility = Visibility.Hidden;
            }
            else
            {
                if ((int)drawCellImage.Tag == 1)
                {
                    smallThingLines.Visibility = Visibility.Visible;
                }
            }
        }

        private void MoveWorld(System.Windows.Point point)
        {

            if (point.X + viewbox.ActualWidth < EcosystemExplorerGrid.ActualWidth - EcosystemExplorerGrid.ActualWidth / 2)
            {
                point.X = EcosystemExplorerGrid.ActualWidth - viewbox.ActualWidth - EcosystemExplorerGrid.ActualWidth / 2;
            }

            if (point.Y + viewbox.ActualHeight < EcosystemExplorerGrid.ActualHeight - EcosystemExplorerGrid.ActualHeight / 2)
            {
                point.Y = EcosystemExplorerGrid.ActualHeight - viewbox.ActualHeight - EcosystemExplorerGrid.ActualHeight / 2;
            }

            if (point.X > 0)
            {
                point.X = 0;
            }

            if (point.Y > 0)
            {
                point.Y = 0;
            }


            viewbox.Margin = new Thickness(point.X, point.Y, 0, 0);

            double alpha = viewbox.ActualHeight / cellSize;
            //horisontalNavigationGrid.Margin = new Thickness(0, viewbox.Margin.Top / alpha, 0, viewbox.Margin.Top / alpha - 30);
            //horisontalNavigationGrid.UpdateLayout();

            //verticalNavigationGrid.Margin = new Thickness(viewbox.Margin.Left / alpha, 0, viewbox.Margin.Left / alpha - 30, 0);
            //verticalNavigationGrid.UpdateLayout();

            lastPoint = point;

        }

        private void Window_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            switch (e.Key)
            {
                case Key.Left:
                    lastPoint.X += 100.0f;
                    MoveWorld(lastPoint);
                    break;
                case Key.Right:
                    lastPoint.X -= 100.0f;
                    MoveWorld(lastPoint);
                    break;
                case Key.Up:
                    lastPoint.Y += 100.0f;
                    MoveWorld(lastPoint);
                    break;
                case Key.Down:
                    lastPoint.Y -= 100.0f;
                    MoveWorld(lastPoint);
                    break;
                case Key.Home:
                    lastPoint.X = 0.0f;
                    MoveWorld(lastPoint);
                    break;
                case Key.End:
                    lastPoint.X = EcosystemExplorerGrid.ActualWidth - viewbox.ActualWidth - EcosystemExplorerGrid.ActualWidth / 2;
                    MoveWorld(lastPoint);
                    break;
                case Key.PageUp:
                    lastPoint.Y = 0;
                    MoveWorld(lastPoint);
                    break;
                case Key.PageDown:
                    lastPoint.Y = EcosystemExplorerGrid.ActualHeight - viewbox.ActualHeight;
                    MoveWorld(lastPoint);
                    break;
                case Key.OemPlus:
                    currentZoom += 10;
                    Zoom(lastPoint);
                    break;
                case Key.OemMinus:
                    currentZoom -= 10;
                    Zoom(lastPoint);
                    break;


            }
        }



        /// <summary>
        /// Zoom когда пользователь вращает колесеко мышки. Учитывается положени мыши относительно центра окна - зум происходит со сдвигом к позиции указателя мыши. 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void EcosystemExplorerGrid_PreviewMouseWheel(object sender, MouseWheelEventArgs e)
        {
            //в зависемости от текущего масштаба вычисляем делту колеса мыши
            double tempZoom = (viewbox.ActualWidth + e.Delta * zoomFactor) / (cellSize / 100);
            double zoom = tempZoom * (cellSize / 100);

            if ((zoom > EcosystemExplorerGrid.ActualWidth / 4) && (zoom > EcosystemExplorerGrid.ActualHeight / 4))
            {
                //из e. события запрашиваем координаты указателя мыши относительно EcosystemExplorerGrid
                System.Windows.Point point = e.GetPosition(EcosystemExplorerGrid);
                double aspect = zoom / viewbox.ActualWidth;

                //пересчитываем относительный сдвиг - вверх
                point.X -= (Math.Abs(viewbox.Margin.Left) + point.X) * aspect;
                point.Y -= (Math.Abs(viewbox.Margin.Top) + point.Y) * aspect;

                //ecosystemExplorerTextBlock.Text = point.X.ToString() + ":" + point.Y.ToString();
                currentZoom = tempZoom;
                zoomTextBox.Text = currentZoom.ToString("F");
                Zoom(point);
            }
            if (e.RoutedEvent != null)
            {
                e.Handled = true;
            }
        }

        /// <summary>
        /// Когда пользователь двигает мышь с зажатой кнопкой над сеткой 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void EcosystemExplorerGrid_PreviewMouseMove(object sender, MouseEventArgs e)
        {
            //int x = (int)e.GetPosition(ThingGrid).X;
            //int y = (int)e.GetPosition(ThingGrid).Y;

            if (e.MiddleButton == MouseButtonState.Pressed)
            {
                System.Windows.Point point = e.GetPosition(EcosystemExplorerGrid);
                point.X = hOffset - (downPoint.X - point.X);
                point.Y = vOffset - (downPoint.Y - point.Y);

                MoveWorld(point);
            }

            if (e.LeftButton == MouseButtonState.Pressed)
            {
                if ((int)autoScrollImage.Tag == 1)
                {
                    System.Windows.Point point = e.GetPosition(EcosystemExplorerGrid);

                    if (point.X < 40)
                    {
                        point.X = viewbox.Margin.Left + 2;
                        point.Y = viewbox.Margin.Top;
                        MoveWorld(point);
                    }
                    else
                        if (point.X > EcosystemExplorerGrid.ActualWidth - 40)
                    {
                        point.X = viewbox.Margin.Left - 2;
                        point.Y = viewbox.Margin.Top;
                        MoveWorld(point);
                    }
                    else
                        if (point.Y < 40)
                    {
                        point.X = viewbox.Margin.Left;
                        point.Y = viewbox.Margin.Top + 2;
                        MoveWorld(point);
                    }
                    else
                        if (point.Y > EcosystemExplorerGrid.ActualHeight - 40)
                    {
                        point.X = viewbox.Margin.Left;
                        point.Y = viewbox.Margin.Top - 2;
                        MoveWorld(point);
                    }
                }
            }
        }

        /// <summary>
        /// Клик в сетку - запоминаем позицию, возможно пользователь зажмет кнопку на мыши и будет ею двигать
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void EcosystemExplorerGrid_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.MiddleButton == MouseButtonState.Pressed)
            {
                downPoint = e.GetPosition(EcosystemExplorerGrid);
                hOffset = viewbox.Margin.Left;
                vOffset = viewbox.Margin.Top;
                EcosystemExplorerGrid.Cursor = Cursors.SizeAll;
            }
            else
            if (e.RightButton == MouseButtonState.Pressed)
            {
                MouseWheelEventArgs mouseWheelEventArgs = new MouseWheelEventArgs(e.MouseDevice, e.Timestamp, 300);
                EcosystemExplorerGrid_PreviewMouseWheel(sender, mouseWheelEventArgs);
            }
        }


        private void ThingGrid_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            //
        }

        private void ThingGrid_PreviewMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            //
        }

        private void EcosystemExplorerGrid_PreviewMouseUp(object sender, MouseButtonEventArgs e)
        {
            if (e.MiddleButton != MouseButtonState.Pressed)
            {
                EcosystemExplorerGrid.Cursor = null;
            }
        }


        private void zoomToOneHImage_MouseDown(object sender, MouseButtonEventArgs e)
        {
            currentZoom = 70.0f;
            double zoom = currentZoom * (cellSize / 100);
            Zoom(new Point(EcosystemExplorerGrid.ActualWidth / 2 - zoom / 2, EcosystemExplorerGrid.ActualHeight / 2 - zoom / 2));

        }



        private void zoomToFullImage_MouseDown(object sender, MouseButtonEventArgs e)
        {
            currentZoom = 20.0f;
            double zoom = currentZoom * (cellSize / 100);
            Zoom(new Point(EcosystemExplorerGrid.ActualWidth / 2 - zoom / 2, EcosystemExplorerGrid.ActualHeight / 2 - zoom / 2));

        }

        /// <summary>
        /// Переключатель - выбирает режимы при котором сетка движется автоматически, если пользователь зацепил объект мышью
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void autoScrollImage_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if ((int)autoScrollImage.Tag == 1)
            {
                autoScrollImage.Tag = 0;
                // autoScrollImage.Source = Icons.GetIcon(431);
            }
            else
            {
                autoScrollImage.Tag = 1;
                //  autoScrollImage.Source = Icons.GetIcon(432);
            }

        }

        /// <summary>
        /// Включает - выключает прорисовку сетки
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void drawCellImage_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if ((int)drawCellImage.Tag == 1)
            {
                drawCellImage.Tag = 0;
                verticalNavigationGrid.Visibility = horisontalNavigationGrid.Visibility = smallThingLines.Visibility = ThingLines.Visibility = Visibility.Hidden;

            }
            else
            {
                drawCellImage.Tag = 1;
                verticalNavigationGrid.Visibility = horisontalNavigationGrid.Visibility = ThingLines.Visibility = Visibility.Visible;
                if (currentZoom > 40)
                {
                    smallThingLines.Visibility = Visibility.Visible;
                }
            }

        }

        private void transparentViewImage_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (AllowsTransparency)
            {
                EcosystemManagerWindow ecosystemExplorer = new EcosystemManagerWindow();
                ecosystemExplorer.Show();
                Close();
            }
            else
            {

                EcosystemManagerWindow ecosystemExplorer = new EcosystemManagerWindow
                {
                    AllowsTransparency = true,
                    WindowStyle = WindowStyle.None,
                    Background = null
                };
                ecosystemExplorer.Show();
                Close();
            }
        }

        private void duplicateWindowImage_MouseDown(object sender, MouseButtonEventArgs e)
        {
            EcosystemManagerWindow ecosystemExplorer = new EcosystemManagerWindow();
            ecosystemExplorer.Show();

        }



        /// <summary>
        /// Переключатель плоский или наклоный просмотр сетки
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void perspectiveViewImage_MouseDown(object sender, MouseButtonEventArgs e)
        {

            DoubleAnimation skewGrassX;
            DoubleAnimation skewGrassY;
            DoubleAnimation rotate;

            if ((explorerGrid.Tag == null) || (explorerGrid.Tag.ToString().Equals("1")))
            {
                skewGrassX = new DoubleAnimation(-15.0f, new Duration(TimeSpan.FromMilliseconds(2000)));
                skewGrassY = new DoubleAnimation(-10.0f, new Duration(TimeSpan.FromMilliseconds(2000)));
                rotate = new DoubleAnimation(17.0f, new Duration(TimeSpan.FromMilliseconds(2000)));
                explorerGrid.Tag = "0";
            }
            else
            {
                skewGrassX = new DoubleAnimation(-15.0f, 0.0f, new Duration(TimeSpan.FromMilliseconds(2000)));
                skewGrassY = new DoubleAnimation(-10.0f, 0.0f, new Duration(TimeSpan.FromMilliseconds(2000)));
                rotate = new DoubleAnimation(17.0f, 0.0f, new Duration(TimeSpan.FromMilliseconds(2000)));
                explorerGrid.Tag = "1";
            }

            SkewTransform skewTransformX = new SkewTransform();
            SkewTransform skewTransformY = new SkewTransform();
            RotateTransform rotateTransform = new RotateTransform();

            TransformGroup transformGroup = new TransformGroup();
            transformGroup.Children.Add(skewTransformX);
            transformGroup.Children.Add(skewTransformY);
            transformGroup.Children.Add(rotateTransform);

            explorerGrid.LayoutTransform = transformGroup;

            skewTransformX.BeginAnimation(SkewTransform.AngleXProperty, skewGrassX);
            skewTransformY.BeginAnimation(SkewTransform.AngleYProperty, skewGrassY);
            rotateTransform.BeginAnimation(RotateTransform.AngleProperty, rotate);
        }

    }
}
