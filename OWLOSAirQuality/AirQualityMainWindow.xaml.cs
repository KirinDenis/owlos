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
using OWLOSAirQuality.OWLOSEcosystemService;
using System;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
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
        private readonly bool timerBusy = false;

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


        private readonly HudFrame hudFrame;

        private readonly GraphFrame graphFrame;

        private bool Zoomed = false;
        private Thickness StoredZoomThickness;

        public AirQualityMainWindow()
        {
            InitializeComponent();

            
            Timer lifeCycleTimer = new Timer(60 * 1000)
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
                       
            hudFrame = new HudFrame();
            hudFrame.MainGrid.Children.Remove(hudFrame.HudHolderGrid);
            hudFrame.Close();
            MainGrid.Children.Add(hudFrame.HudHolderGrid);

            graphFrame = new GraphFrame();
            graphFrame.MainGrid.Children.Remove(graphFrame.GraphHoderGrid);
            graphFrame.Close();
            MainGrid.Children.Add(graphFrame.GraphHoderGrid);


            ValueFrame valueFrame = new ValueFrame();
            valueFrame.MainGrid.Children.Remove(valueFrame.ValueHolderGrid);
            valueFrame.Close();
            MainGrid.Children.Add(valueFrame.ValueHolderGrid);

            GasFrame gasFrame = new GasFrame();
            gasFrame.MainGrid.Children.Remove(gasFrame.ValueHolderGrid);
            gasFrame.Close();
            MainGrid.Children.Add(gasFrame.ValueHolderGrid);

            LogFrame logFrame = new LogFrame();
            logFrame.MainGrid.Children.Remove(logFrame.LogHolderGrid);
            logFrame.Close();
            MainGrid.Children.Add(logFrame.LogHolderGrid);

            Frame_00.OnSelect += Frame_00_OnSelect;
            Frame_10.OnSelect += Frame_10_OnSelect;
            Frame_20.OnSelect += Frame_20_OnSelect;

            Frame_01.OnSelect += Frame_01_OnSelect;
            Frame_11.OnSelect += Frame_11_OnSelect;
            Frame_21.OnSelect += Frame_21_OnSelect;

            ZoomFrame.OnSelect += ZoomFrame_OnSelect;


            //Double 
            /*
            valueFrame = new ValueFrame();
            valueFrame.MainGrid.Children.Remove(valueFrame.ValueHolderGrid);
            valueFrame.Close();
            valueFrame.ValueHolderGrid.SetValue(Grid.ColumnProperty, 1);
            valueFrame.ValueHolderGrid.SetValue(Grid.RowProperty, 1);
            MainGrid.Children.Add(valueFrame.ValueHolderGrid);

            
            valueFrame = new ValueFrame();
            valueFrame.MainGrid.Children.Remove(valueFrame.ValueHolderGrid);
            valueFrame.Close();
            valueFrame.ValueHolderGrid.SetValue(Grid.ColumnProperty, 0);
            valueFrame.ValueHolderGrid.SetValue(Grid.RowProperty, 2);
            MainGrid.Children.Add(valueFrame.ValueHolderGrid);

            valueFrame = new ValueFrame();
            valueFrame.MainGrid.Children.Remove(valueFrame.ValueHolderGrid);
            valueFrame.Close();
            valueFrame.ValueHolderGrid.SetValue(Grid.ColumnProperty, 2);
            valueFrame.ValueHolderGrid.SetValue(Grid.RowProperty, 2);
            MainGrid.Children.Add(valueFrame.ValueHolderGrid);
            */

            logFrame = new LogFrame();
            logFrame.MainGrid.Children.Remove(logFrame.LogHolderGrid);
            logFrame.Close();
            logFrame.LogHolderGrid.SetValue(Grid.ColumnProperty, 1);
            logFrame.LogHolderGrid.SetValue(Grid.RowProperty, 2);
            MainGrid.Children.Add(logFrame.LogHolderGrid);

            graphFrame = new GraphFrame();
            graphFrame.MainGrid.Children.Remove(graphFrame.GraphHoderGrid);
            graphFrame.Close();
            graphFrame.GraphHoderGrid.SetValue(Grid.ColumnProperty, 2);
            graphFrame.GraphHoderGrid.SetValue(Grid.RowProperty, 1);
            MainGrid.Children.Add(graphFrame.GraphHoderGrid);


        }

        private void ZoomFrame_OnSelect(object sender, EventArgs e)
        {
            if (Zoomed)
            {
                Zoomed = false;
                StoredZoomThickness = viewbox.Margin;
                NavigateFrame(new Thickness(0, 0, 0, 0));
                viewbox.Width = 1920;
                viewbox.Height = 1080;
            }
            else
            {
                Zoomed = true;
                NavigateFrame(new Thickness(0, 0, 0, 0));
                viewbox.Width = 5760;
                viewbox.Height = 3240;                
            }
        }

        private void NavigateFrame(Thickness ToThickness)
        {
            Storyboard storyboard = new Storyboard();
            ThicknessAnimation thicknessAnimation = new ThicknessAnimation();
            thicknessAnimation.BeginTime = new TimeSpan(0);
            thicknessAnimation.SetValue(Storyboard.TargetNameProperty, "viewbox");
            Storyboard.SetTargetProperty(thicknessAnimation, new PropertyPath(MarginProperty));

            thicknessAnimation.From = new Thickness(viewbox.Margin.Left, viewbox.Margin.Top, viewbox.Margin.Right, viewbox.Margin.Top);
            thicknessAnimation.To = ToThickness; 
            thicknessAnimation.Duration = new Duration(TimeSpan.FromSeconds(1));

            storyboard.Children.Add(thicknessAnimation);
            storyboard.Begin(this);

        }
        private void Frame_00_OnSelect(object sender, EventArgs e)
        {
            NavigateFrame(new Thickness(0, 0, 0, 0));
        }

        private void Frame_10_OnSelect(object sender, EventArgs e)
        {
            NavigateFrame(new Thickness(-1920, 0, 0, 0));
        }

        private void Frame_20_OnSelect(object sender, EventArgs e)
        {
            NavigateFrame(new Thickness(-1920 * 2, 0, 0, 0));            
        }

        private void Frame_01_OnSelect(object sender, EventArgs e)
        {
            NavigateFrame(new Thickness(0, -1080, 0, 0));
        }

        private void Frame_11_OnSelect(object sender, EventArgs e)
        {
            NavigateFrame(new Thickness(-1920, -1080, 0, 0));
        }

        private void Frame_21_OnSelect(object sender, EventArgs e)
        {
            NavigateFrame(new Thickness(-1920 * 2, -1080, 0, 0));
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

    }
}
