/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

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

(Этот файл — часть Ready IoT Solution - OWLOS.

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

using OWLOSAdmin.EcosystemExplorer.Huds;
using OWLOSAirQuality.Huds;
using OWLOSThingsManager.EcosystemExplorer.Huds;
using System;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Timers;

namespace OWLOSAirQuality
{
    public partial class AirQualityWindow : Window
    {
        private double transportRadius = Gold.radius - Gold.radius2 + (Gold.radius2 - Gold.radius3) / 2;

        private readonly Path ThingShadowPath;
        private readonly Path ThingPath;
        
        private readonly Path insideThingPath;
        private readonly Path insideThingPath2;
        private readonly Path freeHeapPathBack;

        private Timer lifeCycleTimer;

        private ConsoleControl console;

        private DateControl dateControl;
        private TimeControl timeControl;

        private double gA = 0;
        private GraphControl graph1;
        private GraphControl graph2;
        private GraphControl graph3;
        private GraphControl graph4;

        private Random r;

        private double[] data3;

        public AirQualityWindow()
        {
            InitializeComponent();

            ThingShadowPath = new Path();
            ThingPath = new Path();
        
            insideThingPath = new Path();
            insideThingPath2 = new Path();
            freeHeapPathBack = new Path();

            ThingShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSPrimaryAlpha2"];
            ThingPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSPrimary"];
            
            insideThingPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSSecondary"];
            insideThingPath2.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSPrimaryAlpha2"];
            freeHeapPathBack.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSPrimary"];

            HudGrid.Children.Add(ThingShadowPath);
            HudGrid.Children.Add(ThingPath);
            

            //HudGrid.Children.Add(insideThingPath);
            //HudGrid.Children.Add(insideThingPath2);
            //HudGrid.Children.Add(freeHeapPathBack);

            ThingShadowPath.Data = ThingPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius, 0, 359);
            ThingShadowPath.StrokeThickness = ThingPath.StrokeThickness = 4;
            

            insideThingPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius3, 0, 359);
            insideThingPath2.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius2, 0, 359);
            freeHeapPathBack.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius5, 11, 200);
            freeHeapPathBack.StrokeThickness = Gold.radius8;

            /*
            //Transport Hud over markers RECONNECT ---
            Path transportOwerPathRECONNECT = new Path();
            transportOwerPathRECONNECT.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha2"];
            transportOwerPathRECONNECT.Data = HudLibrary.DrawArc(Gold.center, Gold.center, transportRadius, 180, 270);
            transportOwerPathRECONNECT.StrokeThickness = Gold.radius5;
            transportOwerPathRECONNECT.RenderTransformOrigin = new Point(0.5f, 0.5f);
            transportOwerPathRECONNECT.HorizontalAlignment = HorizontalAlignment.Center;
            transportOwerPathRECONNECT.VerticalAlignment = VerticalAlignment.Center;
            transportOwerPathRECONNECT.Width = Gold.size;
            transportOwerPathRECONNECT.Height = Gold.size;
            HudGrid.Children.Add(transportOwerPathRECONNECT);
            */

            //console = new ConsoleControl();
            //HudGrid.Children.Add(console);

            Random random = new Random();
            for (int i = 0; i < 0; i++)
            {
                int w = 40 + random.Next(40);
                PetalControl petal = new PetalControl(Gold.radius - random.Next((int)Gold.radius), w + random.Next(270), w, random.Next(10) + 20, i.ToString());
                HudGrid.Children.Add(petal);
                petal.AnimatedRotation(-5000 + random.Next(10000), 30000 + random.Next(100000));

                petal.petalBackground.Stroke = new SolidColorBrush(Color.FromArgb((byte)random.Next(255), (byte)random.Next(255), (byte)random.Next(255), (byte)random.Next(255)));

            }

            
            dateControl = new DateControl(DateTimeGrid, Gold.radius, DateTime.Now);
            timeControl = new TimeControl(DateTimeGrid, Gold.radius, DateTime.Now);

            WeatherControl weatherControl = new WeatherControl();
            WeatherGrid.Children.Add(weatherControl);

            r = new Random();
            double[] data = new double[45];
            for (int i = 0; i < data.Length; i++)
            {
                data[i] = i / 5;                
            }

            data3 = new double[45];
            for (int i = 0; i < data3.Length; i++)
            {
                data3[i] = r.NextDouble() * 30.0f;
                
                /*
                if ((i & 1) > 0)
                {
                    data3[i] = 30;                
                }
                else
                {
                    data3[i] = 0;
                }
                */
            }

            graph1 = new GraphControl();
            graph1.raysAnimationSpeed = 200;
            WeatherGrid.Children.Add(graph1);
            graph1.data = data;

            double[] data2 = new double[90];
            for (int i = 0; i < data2.Length; i++)
            {
                // data[i] = r.NextDouble() * 50.0f;

                data2[i] = i / 5;
            }

            graph2 = new GraphControl();
            graph2.angle = 90;
            graph2.raysStep = 1.0f;
            WeatherGrid.Children.Add(graph2);
            graph2.data = data2;

            graph3 = new GraphControl();
            graph3.angle = 180;
            graph3.raysAnimationSpeed = 200;
            graph3.ColorGradient1= (App.Current.Resources["OWLOSSuccessAlpha1"] as SolidColorBrush).Color;
            graph3.ColorGradient2 = (App.Current.Resources["OWLOSSuccess"] as SolidColorBrush).Color;
            WeatherGrid.Children.Add(graph3);
            graph3.data = data3;

            graph4 = new GraphControl();
            graph4.angle = 270;
            graph4.ColorGradient1 = (App.Current.Resources["OWLOSWarningAlpha1"] as SolidColorBrush).Color;
            graph4.ColorGradient2 = (App.Current.Resources["OWLOSDanger"] as SolidColorBrush).Color;
            WeatherGrid.Children.Add(graph4);
            graph4.data = data3;



            lifeCycleTimer = new Timer(1000)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();
            OnLifeCycleTimer(null, null);


        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            //console.AddToconsole("123123123", 4);            

            base.Dispatcher.Invoke(() =>
            {
                dateControl.SetDate(DateTime.Now);
                timeControl.SetTime(DateTime.Now);

                double a = data3[0];
                for (int i = 0; i < data3.Length-1; i++)
                {
                    data3[i] = data3[i + 1];
                }
                data3[data3.Length - 1] = a;
                graph3.data = data3;
                graph4.data = data3;
            });
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            DoubleAnimation rotateAnimation = new DoubleAnimation()
            {
                From = 1.0f,
                To = 1.23f,
                Duration = new Duration(TimeSpan.FromMilliseconds(1000)),
                AutoReverse = false
            };

            DateTimeGrid.RenderTransform = new ScaleTransform();
            DateTimeGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleXProperty, rotateAnimation);
            DateTimeGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleYProperty, rotateAnimation);

            WeatherGrid.RenderTransform = new ScaleTransform();
            WeatherGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleXProperty, rotateAnimation);
            WeatherGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleYProperty, rotateAnimation);

        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            DoubleAnimation rotateAnimation = new DoubleAnimation()
            {
                From = 1.23,
                To = 1.0f,
                Duration = new Duration(TimeSpan.FromMilliseconds(1000)),
                AutoReverse = false
            };

            DateTimeGrid.RenderTransform = new ScaleTransform();
            DateTimeGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleXProperty, rotateAnimation);
            DateTimeGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleYProperty, rotateAnimation);

            WeatherGrid.RenderTransform = new ScaleTransform();
            WeatherGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleXProperty, rotateAnimation);
            WeatherGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleYProperty, rotateAnimation);

        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            DoubleAnimation rotateAnimation = new DoubleAnimation()
            {
                From = 1.0,
                To = 0.0f,
                Duration = new Duration(TimeSpan.FromMilliseconds(1000)),
                AutoReverse = false
            };

            DateTimeGrid.RenderTransform = new ScaleTransform();
            DateTimeGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleXProperty, rotateAnimation);
            DateTimeGrid.RenderTransform.BeginAnimation(ScaleTransform.ScaleYProperty, rotateAnimation);

        }

        private void Button_Click_3(object sender, RoutedEventArgs e)
        {
            double[] data = new double[45];
            for (int i = 0; i < data.Length; i++)
            {
                data[i] = r.NextDouble() * 30.0f;

                //data[i] = i / 5;
            }

            double[] data2 = new double[90];
            for (int i = 0; i < data2.Length; i++)
            {
                 data2[i] = r.NextDouble() * 30.0f;

                //data2[i] = i / 5;
            }

            double a = data3[0];
            for (int i = 0; i < data3.Length-1; i++)
            {
                data3[i] = data3[i + 1];
            }
            data3[data3.Length - 1] = a;


            graph1.data = data;
            graph2.data = data2;
            graph3.data = data3;
            graph4.data = data3;

        }
    }
}
