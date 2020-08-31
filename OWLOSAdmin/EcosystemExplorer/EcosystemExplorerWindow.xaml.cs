using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOSNode;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Text;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Windows.Threading;
using Point = System.Windows.Point;

namespace OWLOSAdmin.EcosystemExplorer
{
    /// <summary>
    /// Interaction logic for EcosystemExplorerWindow.xaml
    /// </summary>
    public partial class EcosystemExplorerWindow : Window
    {
        /// <summary>
        /// Width and Height of cell
        /// </summary>
        private const int cellSize = 10000;

        private const int cellStep = 25;

        private System.Windows.Point downPoint;
        private double hOffset, vOffset;

        //  UIColors colorChema = new UIColors();
        /// <summary>
        /// Cell zoom factor (mouse while zoom)
        /// </summary>
        public double zoomFactor = 5.4f;

        private double pZoom;


        public EcosystemExplorerWindow()
        {
            InitializeComponent();

            OWLOSNode node = new OWLOSNode();
            

            nodeGrid.Width = nodeGrid.Height = cellSize;
            viewbox.Width = viewbox.Height = cellSize / 10;

            autoScrollImage.Tag = (int)0;
            drawCellImage.Tag = (int)1;

            // nodeGrid.Tag = nodeTreeView;


            Dispatcher.BeginInvoke((Action)DrawCell, DispatcherPriority.Send);

            NodeControl nodeCountrol1 = new NodeControl();
            nodeGrid.Children.Add(nodeCountrol1);

            NodeControl nodeCountrol2 = new NodeControl();
            nodeGrid.Children.Add(nodeCountrol2);

            NodeControl nodeCountrol3 = new NodeControl();
            nodeGrid.Children.Add(nodeCountrol3);

            var relationLine = new EcosystemRelationLine(nodeCountrol1, nodeCountrol1, nodeCountrol2, nodeCountrol1, nodeGrid);
            relationLine.DrawRelationLine();


        }

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
            var size = new System.Drawing.Rectangle(0, 0, bitmapSize, bitmapSize);
            //Выделяем место для наших линий дабы потом их отрендерить в UI
            BitmapSource bsSmallBlack, bsBlackRed, bsBlackGreenHorizontal, bsBlackGreenVertical, bsBlackGreenCenter;

            //Подготавливаем колажи где будут нарисованы наши линии
            using (var blackBitmap = new Bitmap(bitmapSize, bitmapSize))
            using (var smallBlackBitmap = new Bitmap(bitmapSize, bitmapSize))
            using (var greenBitmapVertical = new Bitmap(bitmapSize, bitmapSize))
            using (var greenBitmapHorizontal = new Bitmap(bitmapSize, bitmapSize))
            using (var redBitmap = new Bitmap(bitmapSize, bitmapSize))
            {
                var mediaColorBrushGreen = (SolidColorBrush)App.Current.Resources["OWLOSSuccess"];
                System.Drawing.Color colorGreen = System.Drawing.Color.FromArgb(mediaColorBrushGreen.Color.A,
                                                             mediaColorBrushGreen.Color.R,
                                                             mediaColorBrushGreen.Color.G,
                                                             mediaColorBrushGreen.Color.B);
                var mediaColorBrushRed = (SolidColorBrush)App.Current.Resources["OWLOSDanger"];
                System.Drawing.Color colorRed = System.Drawing.Color.FromArgb(mediaColorBrushRed.Color.A,
                                                             mediaColorBrushRed.Color.R,
                                                             mediaColorBrushRed.Color.G,
                                                             mediaColorBrushRed.Color.B);
                var mediaColorBrushBlack = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha3"];
                System.Drawing.Color colorBlack = System.Drawing.Color.FromArgb(mediaColorBrushBlack.Color.A,
                                                             mediaColorBrushBlack.Color.R,
                                                             mediaColorBrushBlack.Color.G,
                                                             mediaColorBrushBlack.Color.B);
                var penGreen = new System.Drawing.Pen(colorGreen, 10);
                var penRed = new System.Drawing.Pen(colorRed, 6);
                var penBlack = new System.Drawing.Pen(colorBlack, 2);
                var smallPenBlack = new System.Drawing.Pen(colorBlack, .3f);

                //Подготавливаем почву для рисования линий
                using (var gSmallBlack = System.Drawing.Graphics.FromImage(smallBlackBitmap))
                using (var gBlack = System.Drawing.Graphics.FromImage(blackBitmap))
                using (var gRed = System.Drawing.Graphics.FromImage(redBitmap))
                    //Далее сам процесс отрисовки линий и координат
                    for (int linePosition = 0; linePosition < cellSize; linePosition += cellStep)
                    {
                        System.Drawing.Pen drawingPen = null;
                        System.Drawing.Graphics graphics = null;
                        if (linePosition % 100 == 0)
                        {
                            TextBlock textBlock = new TextBlock();
                            textBlock.Text = linePosition.ToString();
                            textBlock.Margin = new Thickness(linePosition, 0, 0, 0);
                            if (linePosition == cellSize / 2)
                            {
                                textBlock.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSSuccess"];

                                drawingPen = penGreen;
                                graphics = gBlack;
                            }
                            else
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

                            textBlock.VerticalAlignment = VerticalAlignment.Center;
                            horisontalNavigationGrid.Children.Add(textBlock);

                            textBlock = new TextBlock();
                            textBlock.Text = linePosition.ToString();
                            textBlock.Margin = new Thickness(0, linePosition, 0, 0);
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
                            var verticalBegin = new System.Drawing.Point();
                            var verticalEnd = new System.Drawing.Point();

                            var horizontalBegin = new System.Drawing.Point();
                            var horizontalEnd = new System.Drawing.Point();

                            
                            if (drawingPen == penGreen)
                            {
                                //Для зелёных линий отдельно рисуем
                                verticalBegin.X = verticalEnd.X = cellSize / 10;
                                verticalEnd.Y = bitmapSize;
                                horizontalBegin.Y = horizontalEnd.Y = cellSize / 10;
                                horizontalBegin.X = 0;
                                horizontalEnd.X = bitmapSize;

                                using (var gGreenVertical = System.Drawing.Graphics.FromImage(greenBitmapVertical))
                                    gGreenVertical.DrawLine(drawingPen, verticalBegin, verticalEnd);
                                using (var gGreenHorizontal = System.Drawing.Graphics.FromImage(greenBitmapHorizontal))
                                    gGreenHorizontal.DrawLine(drawingPen, horizontalBegin, horizontalEnd);
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
                var horizontalVirtualStackPanel = new VirtualizingStackPanel();
                horizontalVirtualStackPanel.Orientation = Orientation.Horizontal;
                nodeLines.Children.Add(horizontalVirtualStackPanel);
                //Поле для маленьких линий
                var smallHorizontalVirtualStackPanel = new VirtualizingStackPanel();
                smallHorizontalVirtualStackPanel.Orientation = Orientation.Horizontal;
                smallNodeLines.Children.Add(smallHorizontalVirtualStackPanel);
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
                        Source = bitmapSource
                    };
                    horizontalVirtualStackPanel.Children.Add(image);

                    System.Windows.Controls.Image smallImage = new System.Windows.Controls.Image
                    {
                        Source = bsSmallBlack
                    };
                    smallHorizontalVirtualStackPanel.Children.Add(smallImage);
                }
            }

            horisontalNavigationGrid.Visibility = Visibility.Visible;
            verticalNavigationGrid.Visibility = Visibility.Visible;
        }

        private static BitmapSource CombineBitmaps(System.Drawing.Rectangle size, params System.Drawing.Bitmap[] args)
        {

            using (var bitmap = new System.Drawing.Bitmap(size.Width, size.Height))
            {
                using (var gA = System.Drawing.Graphics.FromImage(bitmap))
                {
                    foreach (var b in args)
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

        private void Zoom(System.Windows.Point point)
        {
            double tempZoom = double.NaN;
            if (!double.TryParse(zoomTextBox.Text, out tempZoom))
            {
                return;
            }
            pZoom = tempZoom;
            double zoom = tempZoom * (cellSize / 100);



            if ((zoom > EcosystemExplorerGrid.ActualWidth) && (zoom > EcosystemExplorerGrid.ActualHeight))
            {
                viewbox.Width = zoom;
                viewbox.Height = zoom;
                viewbox.UpdateLayout();
                MoveWorld(point);
            }
            else
            {
                viewbox.Width = viewbox.Height = EcosystemExplorerGrid.ActualWidth;
            }

            if (pZoom < 40)
            {
                smallNodeLines.Visibility = Visibility.Hidden;
            }
            else
            {
                if ((int)drawCellImage.Tag == 1)
                {
                    smallNodeLines.Visibility = Visibility.Visible;
                }
            }

        }

        private void MoveWorld(System.Windows.Point point)
        {
            if (point.X + viewbox.ActualWidth < EcosystemExplorerGrid.ActualWidth) point.X = EcosystemExplorerGrid.ActualWidth - viewbox.ActualWidth;
            if (point.Y + viewbox.ActualHeight < EcosystemExplorerGrid.ActualHeight) point.Y = EcosystemExplorerGrid.ActualHeight - viewbox.ActualHeight;
            if (point.X > 0) point.X = 0;
            if (point.Y > 0) point.Y = 0;

            viewbox.Margin = new Thickness(point.X, point.Y, 0, 0);

            double alpha = viewbox.ActualHeight / cellSize;
            horisontalNavigationGrid.Margin = new Thickness(0, viewbox.Margin.Top / alpha, 0, viewbox.Margin.Top / alpha - 30);
            horisontalNavigationGrid.UpdateLayout();

            verticalNavigationGrid.Margin = new Thickness(viewbox.Margin.Left / alpha, 0, viewbox.Margin.Left / alpha - 30, 0);
            verticalNavigationGrid.UpdateLayout();

        }




        private void nodeGrid_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            //
        }

        private void nodeGrid_PreviewMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

        }

        private void EcosystemExplorerGrid_PreviewMouseWheel(object sender, MouseWheelEventArgs e)
        {
            double tempZoom = (viewbox.ActualWidth + e.Delta * zoomFactor) / (cellSize / 100);
            double zoom = tempZoom * (cellSize / 100);

            if ((zoom > EcosystemExplorerGrid.ActualWidth) && (zoom > EcosystemExplorerGrid.ActualHeight))
            {
                System.Windows.Point point = e.GetPosition(EcosystemExplorerGrid);
                double aspect = zoom / viewbox.ActualWidth;

                point.X -= (Math.Abs(viewbox.Margin.Left) + point.X) * aspect;
                point.Y -= (Math.Abs(viewbox.Margin.Top) + point.Y) * aspect;

                //ecosystemExplorerTextBlock.Text = point.X.ToString() + ":" + point.Y.ToString();
                zoomTextBox.Text = tempZoom.ToString("F");
                Zoom(point);
            }
            e.Handled = true;

        }


        private void EcosystemExplorerGrid_PreviewMouseUp(object sender, MouseButtonEventArgs e)
        {
            if (e.MiddleButton != MouseButtonState.Pressed)
            {
                EcosystemExplorerGrid.Cursor = null;
            }

        }

        private void EcosystemExplorerGrid_PreviewMouseMove(object sender, MouseEventArgs e)
        {
            int x = (int)e.GetPosition(nodeGrid).X;
            int y = (int)e.GetPosition(nodeGrid).Y;




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

        private void zoomToOneHImage_Click(object sender, RoutedEventArgs e)
        {
            double zoomTo = 70.0f;
            zoomTextBox.Text = (zoomTo).ToString(("F"));
            double zoom = zoomTo * (cellSize / 100);
            Zoom(new Point(EcosystemExplorerGrid.ActualWidth / 2 - zoom / 2, EcosystemExplorerGrid.ActualHeight / 2 - zoom / 2));

        }

        private void zoomToFullImage_Click(object sender, RoutedEventArgs e)
        {
            double zoomTo = 10.0f;
            zoomTextBox.Text = (zoomTo).ToString(("F"));
            double zoom = zoomTo * (cellSize / 100);
            Zoom(new Point(EcosystemExplorerGrid.ActualWidth / 2 - zoom / 2, EcosystemExplorerGrid.ActualHeight / 2 - zoom / 2));

        }

        private void autoScrollImage_Click(object sender, RoutedEventArgs e)
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

        private void drawCellImage_Click(object sender, RoutedEventArgs e)
        {
            if ((int)drawCellImage.Tag == 1)
            {
                drawCellImage.Tag = 0;
                nodeLines.Visibility = Visibility.Hidden;

                smallNodeLines.Visibility = Visibility.Hidden;
            }
            else
            {
                drawCellImage.Tag = 1;
                nodeLines.Visibility = Visibility.Visible;
                if (pZoom > 40)
                {
                    smallNodeLines.Visibility = Visibility.Visible;
                }
            }

        }

        private void animante_Click(object sender, RoutedEventArgs e)
        {
            RenderTargetBitmap bmp = new RenderTargetBitmap((int)contentGrid.ActualWidth, (int)contentGrid.ActualHeight, 96, 96, PixelFormats.Pbgra32);

            bmp.Render(contentGrid);

            var encoder = new PngBitmapEncoder();

            encoder.Frames.Add(BitmapFrame.Create(bmp));

            using (Stream stm = File.Create(@"d:\test.png"))
                encoder.Save(stm);

            int b = 10;
            int limit = 500;
            float steps = 20.8f;
            int step = ((int)(limit / steps));
            Timer t = new Timer(100);
            t.AutoReset = true;
            t.Elapsed += new ElapsedEventHandler((Object source, ElapsedEventArgs e) => {
                b += step; 
                this.Dispatcher.Invoke(() =>
                {
                    if (b >= limit)
                    {
                        test.Text = limit.ToString();
                        t.Stop();
                        return;
                    }
                    test.Text = b.ToString();
                });
            });
            t.Start();

        }

        private void EcosystemExplorerGrid_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.MiddleButton == MouseButtonState.Pressed)
            {
                downPoint = e.GetPosition(EcosystemExplorerGrid);
                hOffset = viewbox.Margin.Left;
                vOffset = viewbox.Margin.Top;
                EcosystemExplorerGrid.Cursor = Cursors.SizeAll;
            }

        }
    }
}
