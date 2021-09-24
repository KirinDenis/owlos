/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

using OWLOSAirQuality.Frames;
using OWLOSAirQuality.Huds;
using OWLOSAirQuality.OWLOSEcosystemService;
using OWLOSEcosystemService.DTO.Things;
using System;
using System.Timers;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;

namespace OWLOSAirQuality
{
    /// <summary>
    /// Interaction logic for AirQualityMainWindow.xaml
    /// </summary>
    public partial class AirQualityMainWindow : Window
    {
        private readonly OWLOSEcosystem ecosystem;        
        private bool timerBusy = false;

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


        private HudFrame hudFrame;

        private GraphFrame graphFrame;

        public AirQualityMainWindow()
        {
            InitializeComponent();

            
            Timer lifeCycleTimer = new Timer(100)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();
            

            //controls



            /*
            for (int i = 0; i < 20; i++)
            {
                ValueControl v1 = new ValueControl();
                ValuesGrid.Children.Add(v1);
            }
            */


            //events     
            ecosystem = App.ecosystem;
            
            

            autoScrollImage.Tag = 0;
            drawCellImage.Tag = 1;

            hudFrame = new HudFrame();
            hudFrame.MainGrid.Children.Remove(hudFrame.HudHolderGrid);
            hudFrame.Close();
            this.MainGrid.Children.Add(hudFrame.HudHolderGrid);

            graphFrame = new GraphFrame();
            graphFrame.MainGrid.Children.Remove(graphFrame.GraphHoderGrid);
            graphFrame.Close();
            this.MainGrid.Children.Add(graphFrame.GraphHoderGrid);

            ValueFrame valueFrame = new ValueFrame();
            valueFrame.MainGrid.Children.Remove(valueFrame.ValuesGrid);
            valueFrame.Close();
            this.MainGrid.Children.Add(valueFrame.ValuesGrid);

            LogFrame logFrame = new LogFrame();
            logFrame.MainGrid.Children.Remove(logFrame.LogGrid);
            logFrame.Close();
            this.MainGrid.Children.Add(logFrame.LogGrid);


        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {

            /*
            AirQualityClientResulDTO airQualityClientResulDTO = await ecosystemServiceClient.GetThingAirQuality("VVRQUndWTzI4dW5YR1Jxb0IyQVpXUU9oaUdURWNBdmlMTHdpSWtMSUxnSVFBQUFBZHc5VllNalU1Sk0rMGNQano5Q0JKVE5oSm94OFNkNHJyNlhHcXRRRHpDZWU1ck1SV0hWQi9CYXM0dngwL0RPemYxTzZ4NWtjc1dCeGpsV3NTTldNWFlIc3hqWlVyd1MzcDBWbnd6OHhuZzJ1eXc2OCtCMm04SlphN1lOcVUxZ2NVMWVmVXdtL3g1SXFTQ3I2YXdhZERnPT0=");

            if ((string.IsNullOrEmpty(airQualityClientResulDTO.error)) && (airQualityClientResulDTO.result != null))
            {
                ThingAirQualityDTO thingAirQualityDTO = JsonConvert.DeserializeObject<ThingAirQualityDTO>(airQualityClientResulDTO.result as string); 
                console.AddToconsole(JsonConvert.SerializeObject(thingAirQualityDTO), 4);
            }
            else
            {
                console.AddToconsole(airQualityClientResulDTO.error, 1);
            }
            */

            /*
            base.Dispatcher.Invoke(() =>
            {

                if (this.MainGrid.ActualWidth != 0)
                {
                    RenderTargetBitmap bitmap =
                        new RenderTargetBitmap((int)this.MainGrid.ActualWidth,
                            (int)this.MainGrid.ActualHeight,
                                  128, 128, PixelFormats.Pbgra32);
                    bitmap.Render(this.MainGrid);

                    FrameMain_00.DisplayImage.Source = bitmap;
                }
                

            });
            */
        }





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

            lastPoint = point;

        }

        private void EcosystemExplorerGrid_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
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

        private void EcosystemExplorerGrid_PreviewMouseUp(object sender, MouseButtonEventArgs e)
        {
            if (e.MiddleButton != MouseButtonState.Pressed)
            {
                EcosystemExplorerGrid.Cursor = null;
            }

        }

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

        private void zoomToOneHImage_Click(object sender, RoutedEventArgs e)
        {
            currentZoom = 70.0f;
            double zoom = currentZoom * (cellSize / 100);
            Zoom(new Point(EcosystemExplorerGrid.ActualWidth / 2 - zoom / 2, EcosystemExplorerGrid.ActualHeight / 2 - zoom / 2));
        }

        private void zoomToFullImage_Click(object sender, RoutedEventArgs e)
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

        /// <summary>
        /// Включает - выключает прорисовку сетки
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void drawCellImage_Click(object sender, RoutedEventArgs e)
        {

        }

        private void iconsViewImage_Click(object sender, RoutedEventArgs e)
        {
            //new IconsToolWindow().Show();
        }

        private void transparentViewImage_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (AllowsTransparency)
            {
                AirQualityMainWindow ecosystemExplorer = new AirQualityMainWindow();
                ecosystemExplorer.Show();
                Close();
            }
            else
            {

                AirQualityMainWindow ecosystemExplorer = new AirQualityMainWindow
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
            AirQualityMainWindow ecosystemExplorer = new AirQualityMainWindow();
            ecosystemExplorer.Show();

        }

        private void zoomToOneHImage_Click(object sender, MouseButtonEventArgs e)
        {

        }


        /// <summary>
        /// Переключатель плоский или наклоный просмотр сетки
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void perspectiveViewImage_Click(object sender, RoutedEventArgs e)
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
