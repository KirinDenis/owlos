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

using OWLOSAirQuality.Huds;
using OWLOSAirQuality.OWLOSEcosystemService;
using OWLOSEcosystemService.DTO.Things;
using System;
using System.Timers;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;

namespace OWLOSAirQuality
{
    /// <summary>
    /// Interaction logic for AirQualityMainWindow.xaml
    /// </summary>
    public partial class AirQualityMainWindow : Window
    {
        private readonly OWLOSEcosystem ecosystem;
        private readonly ConsoleControl logConsole;
        private bool timerBusy = false;

        private ACValueControl DHT22tempValueControl = null;

        private ACValueControl DHT22humValueControl = null;

        private ACValueControl DHT22heatValueControl = null;


        private ACValueControl BMP280pressureValueControl = null;

        private ACValueControl BMP280altitudeValueControl = null;

        private ACValueControl BMP280temperatureValueControl = null;


        private ACValueControl ADS1X15MQ135ValueControl = null;

        private ACValueControl ADS1X15MQ7ValueControl = null;

        private ACValueControl ADS1X15LightValueControl = null;


        private ACValueControl CCS811CO2ValueControl = null;

        private ACValueControl CCS811TVOCValueControl = null;

        private ACValueControl CCS811resistenceValueControl = null;

        private ACValueControl CCS811tempValueControl = null;


        private GraphControl DHT22tempGraphControl = null;

        private GraphControl DHT22humGraphControl = null;

        private GraphControl DHT22heatGraphControl = null;

        private GraphControl BMP280pressureGraphControl = null;

        private GraphControl BMP280altitudeGraphControl = null;

        private GraphControl ADS1X15MQ135GraphControl = null;

        private GraphControl ADS1X15MQ7GraphControl = null;

        private GraphControl ADS1X15LightGraphControl = null;

        private GraphControl CCS811CO2GraphControl = null;

        private GraphControl CCS811TVOCGraphControl = null;

        private GraphControl CCS811resistenceGraphControl = null;

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




        public AirQualityMainWindow()
        {
            InitializeComponent();

            Timer lifeCycleTimer = new Timer(10000)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();

            //controls

            logConsole = new ConsoleControl();
            ConsoleGrid.Children.Add(logConsole);


            /*
            for (int i = 0; i < 20; i++)
            {
                ValueControl v1 = new ValueControl();
                ValuesGrid.Children.Add(v1);
            }
            */


            //events     
            ecosystem = App.ecosystem;
            ecosystem.OnLog += Ecosystem_OnLog;
            ecosystem.OnACDataReady += Ecosystem_OnACDataReady;

            autoScrollImage.Tag = 0;
            drawCellImage.Tag = 1;

        }

        private void Ecosystem_OnACDataReady(object sender, EventArgs e)
        {
         //   if (ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1].DHT22temp != null)
            {
                if (DHT22tempValueControl == null)
                {


                    try
                    {
                        ThingAirQuality acData = ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1];
                        if (acData != null)
                        {
                            DHT22tempValueControl = new ACValueControl(acData.DHT22temp, "DHT22", "Celsius", "Temperature");
                            acData.OnDHT22tempChanged += DHT22tempValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(DHT22tempValueControl);

                            DHT22humValueControl = new ACValueControl(acData.DHT22hum, "DHT22", "%", "Humidity");
                            acData.OnDHT22humChanged += DHT22humValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(DHT22humValueControl);

                            DHT22heatValueControl = new ACValueControl(acData.DHT22heat, "DHT22", "", "Heat Index");
                            acData.OnDHT22heatChanged += DHT22heatValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(DHT22heatValueControl);


                            BMP280pressureValueControl = new ACValueControl(acData.BMP280pressure, "BMP280", "kPa", "Pressure");
                            acData.OnBMP280pressureChanged += BMP280pressureValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(BMP280pressureValueControl);


                            BMP280altitudeValueControl = new ACValueControl(acData.BMP280altitude, "BMP280", "Meters", "Altitude");
                            acData.OnBMP280altitudeChanged += BMP280altitudeValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(BMP280altitudeValueControl);


                            BMP280temperatureValueControl = new ACValueControl(acData.BMP280temperature, "BMP280", "Celsius", "Temperature");
                            acData.OnBMP280temperatureChanged += BMP280temperatureValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(BMP280temperatureValueControl);

                            ADS1X15MQ135ValueControl = new ACValueControl(acData.ADS1X15MQ135, "ADS1X15", "CO2|CO|Alcohol|Smoke|Dust", "MQ135");
                            acData.OnADS1X15MQ135Changed += ADS1X15MQ135ValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(ADS1X15MQ135ValueControl);

                            ADS1X15MQ7ValueControl = new ACValueControl(acData.ADS1X15MQ7, "ADS1X15", "CO", "MQ7");
                            acData.OnADS1X15MQ7Changed += ADS1X15MQ7ValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(ADS1X15MQ7ValueControl);

                            ADS1X15LightValueControl = new ACValueControl(acData.ADS1X15Light, "ADS1X15", "level", "Light");
                            acData.OnADS1X15LightChanged += ADS1X15LightValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(ADS1X15LightValueControl);

                            CCS811CO2ValueControl = new ACValueControl(acData.CCS811CO2, "CCS811", "PPM", "CO2");
                            acData.OnCCS811CO2Changed += CCS811CO2ValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(CCS811CO2ValueControl);

                            CCS811TVOCValueControl = new ACValueControl(acData.CCS811TVOC, "CCS811", "PPM", "TVOC");
                            acData.OnCCS811TVOCChanged += CCS811TVOCValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(CCS811TVOCValueControl);

                            CCS811resistenceValueControl = new ACValueControl(acData.CCS811resistence, "CCS811", "", "Resistance");
                            acData.OnCCS811resistenceChanged += CCS811resistenceValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(CCS811resistenceValueControl);

                            CCS811tempValueControl = new ACValueControl(acData.CCS811temp, "CCS811", "Fahrenheit ", "Temperature");
                            acData.OnCCS811tempChanged += CCS811tempValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(CCS811tempValueControl);


                            //Graph controls 

                            DHT22tempGraphControl = new GraphControl();
                            DHT22tempGraphControl.NameTextBlock.Text = "DHT22 Temperature";
                            GraphGrid.Children.Add(DHT22tempGraphControl);
                                     
                            
                            DHT22humGraphControl = new GraphControl();
                            DHT22humGraphControl.NameTextBlock.Text = "DHT22 Humidity";
                            GraphGrid.Children.Add(DHT22humGraphControl);

                            DHT22heatGraphControl = new GraphControl();
                            DHT22heatGraphControl.NameTextBlock.Text = "DHT22 Heat Index";
                            GraphGrid.Children.Add(DHT22heatGraphControl);

                            BMP280pressureGraphControl = new GraphControl();
                            BMP280pressureGraphControl.NameTextBlock.Text = "BMP280 Pressure";
                            GraphGrid.Children.Add(BMP280pressureGraphControl);

                            BMP280altitudeGraphControl = new GraphControl();
                            BMP280altitudeGraphControl.NameTextBlock.Text = "BMP280 Altitude";
                            GraphGrid.Children.Add(BMP280altitudeGraphControl);

                            CCS811CO2GraphControl = new GraphControl();
                            CCS811CO2GraphControl.NameTextBlock.Text = "CO2";
                            GraphGrid.Children.Add(CCS811CO2GraphControl);

                          //  CCS811TVOCGraphControl = new GraphControl();
                         //   CCS811TVOCGraphControl.NameTextBlock.Text = "TVOC";
                          //  GraphGrid.Children.Add(CCS811TVOCGraphControl);



                            /*

                            ADS1X15MQ135GraphControl = new GraphControl();
                            ADS1X15MQ135GraphControl.NameTextBlock.Text = "MQ135";
                            GraphGrid.Children.Add(ADS1X15MQ135GraphControl);

                            ADS1X15MQ7GraphControl = new GraphControl();
                            ADS1X15MQ7GraphControl.NameTextBlock.Text = "MQ7";
                            GraphGrid.Children.Add(ADS1X15MQ7GraphControl);

                            ADS1X15LightGraphControl = new GraphControl();
                            ADS1X15LightGraphControl.NameTextBlock.Text = "Light";
                            GraphGrid.Children.Add(ADS1X15LightGraphControl);


                            CCS811resistenceGraphControl = new GraphControl();
                            CCS811resistenceGraphControl.NameTextBlock.Text = "Resistance";
                            GraphGrid.Children.Add(CCS811resistenceGraphControl);
                            */
                        }

                        //DHT22TempValueControl = new ACValueControl();
                        //ValuesGrid.Children.Add(DHT22TempValueControl);
                        //ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1 - i * 10].OnDHT22TempChanged += AirQualityMainWindow_OnDHT22TempChanged;
                        //DHT22TempValueControl.ValueTextBlock.Text = ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1 - i * 1000].DHT22temp?.ToString();
                    }
                    catch { }

                }
            }
        }


        private void Ecosystem_OnLog(object sender, OWLOSLogEventArgs e)
        {
            logConsole.AddToconsole(e.Message, e.EventType);
        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            if (timerBusy)
            {
                return;
            }
            timerBusy = true;

            if (ecosystem == null)
            {
                timerBusy = false;
                return;
            }    

            ThingAirQualityHistoryData thingAirQualities = ecosystem.GetOneHourData(0);

            base.Dispatcher.Invoke(() =>
            {
                
                DHT22tempGraphControl.Update(thingAirQualities.DHT22temp, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                DHT22humGraphControl.Update(thingAirQualities.DHT22hum, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                DHT22heatGraphControl.Update(thingAirQualities.DHT22heat, thingAirQualities.QueryTime, thingAirQualities.Statuses);

                BMP280pressureGraphControl.Update(thingAirQualities.BMP280pressure, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                BMP280altitudeGraphControl.Update(thingAirQualities.BMP280altitude, thingAirQualities.QueryTime, thingAirQualities.Statuses);

                CCS811CO2GraphControl.Update(thingAirQualities.CCS811CO2, thingAirQualities.QueryTime, thingAirQualities.Statuses);
               // CCS811TVOCGraphControl.Update(thingAirQualities.CCS811TVOC, thingAirQualities.QueryTime, thingAirQualities.Statuses);

                /*
                DHT22humGraphControl.data = thingAirQualities.DHT22hum;
                DHT22humGraphControl.Draw();

                DHT22heatGraphControl.data = thingAirQualities.DHT22heat;
                DHT22heatGraphControl.Draw();

                BMP280pressureGraphControl.data = thingAirQualities.BMP280pressure;
                BMP280pressureGraphControl.Draw();

                BMP280altitudeGraphControl.data = thingAirQualities.BMP280altitude;
                BMP280altitudeGraphControl.Draw();

                ADS1X15MQ135GraphControl.data = thingAirQualities.ADS1X15MQ135;
                ADS1X15MQ135GraphControl.Draw();

                ADS1X15MQ7GraphControl.data = thingAirQualities.ADS1X15MQ7;
                ADS1X15MQ7GraphControl.Draw();

                ADS1X15LightGraphControl.data = thingAirQualities.ADS1X15Light;
                ADS1X15LightGraphControl.Draw();

                CCS811CO2GraphControl.data = thingAirQualities.CCS811CO2;
                CCS811CO2GraphControl.Draw();

                CCS811TVOCGraphControl.data = thingAirQualities.CCS811TVOC;
                CCS811TVOCGraphControl.Draw();

                CCS811resistenceGraphControl.data = thingAirQualities.CCS811resistence;
                CCS811resistenceGraphControl.Draw();
                */
            });


            /*
            string report = string.Empty;
            //OWLOSEcosystem ecosystem = App.ecosystem;
            foreach(ThingAirQuality ac in ecosystem.dailyAirQulity)
            {
                if (ac != null)
                {
                    report += ac.QueryTime.ToString() + " " + ac.DHT22temp + "|";                    
                }
            }
            base.Dispatcher.Invoke(() =>
            {
            
                text.Text = report;
            });
            */
            
            timerBusy = false;
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
            horisontalNavigationGrid.Margin = new Thickness(0, viewbox.Margin.Top / alpha, 0, viewbox.Margin.Top / alpha - 30);
            horisontalNavigationGrid.UpdateLayout();

            verticalNavigationGrid.Margin = new Thickness(viewbox.Margin.Left / alpha, 0, viewbox.Margin.Left / alpha - 30, 0);
            verticalNavigationGrid.UpdateLayout();

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
