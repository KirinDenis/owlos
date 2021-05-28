/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
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
using OWLOSThingsManager.EcosystemExplorer.Huds;
using PathText;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    /// <summary>
    /// Наружный леписток с именем драйвера и доступом к свойствам драйвера по клику
    /// </summary>
    public partial class PentalControl : UserControl
    {

        /// <summary>
        /// радиальный размер элемента, управляется элементом ноды
        /// </summary>
        protected double radius = 0;

        /// <summary>
        /// угол поворота элемента относительно hud-а ноды
        /// </summary>
        protected double angel = 0;

        protected double length = 0;

        protected bool onceLoaded = false;



        public PentalControl(double radius, double angel, double length, double width, string text)
        {

            InitializeComponent();

            
            this.radius = radius;
            this.angel = angel;
            this.length = length;
          
            double startAngel = 0;
            petalBackground.Data = HudLibrary.DrawArc(Gold.center, Gold.center, radius, startAngel, length);
            petalBackground.StrokeThickness = width;
            petalBorder1.Data = HudLibrary.DrawArc(Gold.center, Gold.center, radius + width / 2, startAngel, length);
            petalBorder2.Data = HudLibrary.DrawArc(Gold.center, Gold.center, radius - width / 2, startAngel, length);


            Ellipse elipse = new Ellipse
            {
                Width = 10,
                Height = 10,
                Fill = (SolidColorBrush)App.Current.Resources["OWLOSWarning"]
            };

            petalNameText.Text = text;

            Rotate(angel);
        }


        public void Rotate(double angel)
        {
            //поворачиваем леписток драйвера относительно hud ноды
            RotateTransform rotateTransform = new RotateTransform
            {
                Angle = angel
            };
            petalMainGrid.RenderTransform = rotateTransform;
        }

        public void AnimatedRotation(double to, long duration)
        {
            DoubleAnimation rotateAnimation = new DoubleAnimation()
            {
                From = angel,
                To = to,
                Duration = new Duration(TimeSpan.FromMilliseconds(duration))
            };

            petalMainGrid.RenderTransform = new RotateTransform();
            petalMainGrid.RenderTransform.BeginAnimation(RotateTransform.AngleProperty, rotateAnimation);

        }

        /// <summary>
        /// Когда элемент загружен - пересчитываем изгиб букв названия драйвера
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            if (!onceLoaded)
            {
                PathTextControl pathText = new PathTextControl(350, 350, radius + 10, 0, length, petalNameText);
                onceLoaded = true;
            }
        }

        private void petalBackground_MouseEnter(object sender, MouseEventArgs e)
        {

            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };

            petalBackground.Stroke = new SolidColorBrush(((SolidColorBrush)petalBackground.Stroke).Color);
            petalBackground.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void petalBackground_MouseLeave(object sender, MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha4"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(2))
            };
            petalBackground.Stroke = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
            petalBackground.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }
    }
}
