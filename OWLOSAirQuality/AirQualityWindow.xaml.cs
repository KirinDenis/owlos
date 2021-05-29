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
            HudGrid.Children.Add(insideThingPath);
            HudGrid.Children.Add(insideThingPath2);
            HudGrid.Children.Add(freeHeapPathBack);

            ThingShadowPath.Data = ThingPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius, 0, 359);
            ThingShadowPath.StrokeThickness = ThingPath.StrokeThickness = Gold.radius7;
            insideThingPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius3, 0, 359);
            insideThingPath2.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius2, 0, 359);
            freeHeapPathBack.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius5, 11, 200);
            freeHeapPathBack.StrokeThickness = Gold.radius8;

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

            Random random = new Random();
            for (int i = 0; i < 1; i++)
            {
                int w = 40 + random.Next(40);
                PentalControl pental = new PentalControl(Gold.radius - random.Next((int)Gold.radius), w + random.Next(270), w, random.Next(10) + 20, i.ToString());
                HudGrid.Children.Add(pental);
                pental.AnimatedRotation(-5000 + random.Next(10000), 30000 + random.Next(100000));

                pental.petalBackground.Stroke = new SolidColorBrush(Color.FromArgb((byte)random.Next(255), (byte)random.Next(255), (byte)random.Next(255), (byte)random.Next(255)));

            }

            console = new ConsoleControl();
            HudGrid.Children.Add(console);


            //Storyboard.SetTarget(rotateAnimation, pental);
            //Storyboard.SetTargetProperty(rotateAnimation, new PropertyPath("(UIElement.RenderTransform).(RotateTransform.Angle)"));


            //storyboard.Children.Add(rotateAnimation);
            //storyboard.Begin();

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
            console.AddToconsole("123123123", 4);
        }
    }
}
