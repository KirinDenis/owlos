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

using OWLOSAdmin.Ecosystem.OWLOS;
using OWLOSAdmin.EcosystemExplorer.Huds;
using PathText;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemExplorer.EcosystemControls
{
    /// <summary>
    /// Наружный леписток с именем драйвера и доступом к свойствам драйвера по клику
    /// </summary>
    public partial class OWLOSNodeDriverControl : OWLOSPetalControl
    {
        /// <summary>
        /// элемент - таблица со свойствами драйвера 
        /// </summary>
        private readonly OWLOSDriverControl driverCountrol = null;

        /// <summary>
        /// нода которой принадлежит этот драйвер
        /// </summary>
        //private readonly OWLOSNodeControl parentOWLOSNodeControl;

        /// <summary>
        /// графический элемент, указывает конец связывающей линии
        /// </summary>
        //private readonly EcosystemControl connector = null;

        /// <summary>
        /// графический элемент, связывающая линия
        /// </summary>
        //private readonly EcosystemRelationLine relationLine = null;

        /// <summary>
        /// драйвер 
        /// </summary>
        private readonly OWLOSDriver driver = null;

        /// <summary>
        /// радиальный размер элемента, управляется элементом ноды
        /// </summary>
        //private readonly double radius = 0;

        /// <summary>
        /// угол поворота элемента относительно hud-а ноды
        /// </summary>
//        private readonly double angel = 0;

//        private OWLOSPetalControl petalControl = null;
        public OWLOSNodeDriverControl(OWLOSNodeControl parentOWLOSNodeControl, OWLOSDriver driver, double radius, double angel) : base(parentOWLOSNodeControl, radius, angel)
        {


  //          this.parentOWLOSNodeControl = parentOWLOSNodeControl;
            this.driver = driver;
      //      this.radius = radius;
        //    this.angel = angel;


            //создаем элемент таблицу отображающею свойста драйвера
            driverCountrol = new OWLOSDriverControl(driver);
            driverCountrol.parentControl.Visibility = Visibility.Hidden;
            driverCountrol.parentControl.Hide();

            //контролируем родительский элемент (hud ноды) если он начнем перемещатся по экосистеме
            //перерисуем соединительную линию
            (parentOWLOSNodeControl.parentControl.Parent as Grid).Children.Add(driverCountrol.parentControl);
            

            //Название драйвера, смотрите UserControl_Loaded - пересчет извиба надписи
            petalNameText.Text = driver.name;


            //создаем и настраиваем соеденительную линию
            relationLine = new EcosystemRelationLine(driverCountrol, driverCountrol.parentControl, connector, driverCountrol, parentOWLOSNodeControl.parentControl.Parent as Grid);
          //  relationLine.DrawRelationLine(((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color.ToString(), ((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color.ToString());
          //  relationLine.Hide();

            petalBackground.PreviewMouseLeftButtonDown += petalBackground_PreviewMouseLeftButtonDown;

            /*

            //подготавливаем конектор - элементы экосистемы могут соединятся друг с другом, в данном случае
            //одна нода имеет множество присоединеных драйверов. По этой причине нужно инкапсулировать много элементов 
            //для соединеня
            connector = new EcosystemControl(null);
            connector.MoveTransform(0, 0);
            connector.Width = 10;
            connector.Height = 10;
            connector.HorizontalAlignment = HorizontalAlignment.Center;
            connector.VerticalAlignment = VerticalAlignment.Top;
            connector.Margin = new Thickness(0, 0, 0, 0);

            Ellipse elipse = new Ellipse();
            elipse.Width = 10;
            elipse.Height = 10;
            elipse.Fill = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
            connector.childHolderGrid.Children.Add(elipse);
          
            driverMainGrid.Children.Add(connector);

            //рисуем лепесток для драйвера
            double _angel = 0;
            //driverBackground.Data = HudLibrary.DrawArc(350, 350, radius, _angel, _angel + 25);
            //driverBorder1.Data = HudLibrary.DrawArc(350, 350, radius + 20, _angel, _angel + 25);
           // driverBorder2.Data = HudLibrary.DrawArc(350, 350, radius - 20, _angel, _angel + 25);

            //поворачиваем леписток драйвера относительно hud ноды
            RotateTransform rotateTransform = new RotateTransform
            {
                Angle = angel * 30
            };
            driverMainGrid.RenderTransform = rotateTransform;

            //Название драйвера, смотрите UserControl_Loaded - пересчет извиба надписи
            driverNameText.Text = driver.name;

            //создаем элемент таблицу отображающею свойста драйвера
            driverCountrol = new OWLOSDriverControl(driver);
            driverCountrol.parentControl.Visibility = Visibility.Hidden;
            driverCountrol.parentControl.Hide();

            //контролируем родительский элемент (hud ноды) если он начнем перемещатся по экосистеме
            //перерисуем соединительную линию
            (parentOWLOSNodeControl.parentControl.Parent as Grid).Children.Add(driverCountrol.parentControl);
            parentOWLOSNodeControl.parentControl.OnPositionChanged += ParentControl_OnPositionChanged;

            //создаем и настраиваем соеденительную линию
            relationLine = new EcosystemRelationLine(driverCountrol, driverCountrol.parentControl, connector, driverCountrol, parentOWLOSNodeControl.parentControl.Parent as Grid);
            // relationLine.DrawRelationLine(((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color.ToString(), ((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color.ToString());
            //relationLine.Hide();
            */

        }
        /*
        private void ParentControl_OnPositionChanged(object sender, EventArgs e)
        {
            if (relationLine.curveLine != null)
            {
                relationLine?.UpdatePositions();
            }
        }

        
        /// <summary>
        /// Когда элемент загружен - пересчитываем изгиб букв названия драйвера
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            //  PathTextControl pathText = new PathTextControl(350, 350, radius + 10, 0, 25, driverNameText);
        }

        private void driverBackground_MouseEnter(object sender, MouseEventArgs e)
        {

            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };
            //   driverBackground.Stroke = new SolidColorBrush(((SolidColorBrush)driverBackground.Stroke).Color);
            //    driverBackground.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);

            if (relationLine.curveLine != null)
            {
                relationLine.curveLine.Stroke = new SolidColorBrush(((SolidColorBrush)relationLine.curveLine.Stroke).Color);
                relationLine.curveLine.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);
            }

            driverCountrol.mainBorder.BorderBrush = new SolidColorBrush(((SolidColorBrush)driverCountrol.mainBorder.BorderBrush).Color);
            driverCountrol.mainBorder.BorderBrush.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void driverBackground_MouseLeave(object sender, MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(2))
            };
            //    driverBackground.Stroke = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
            //    driverBackground.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);

            if (relationLine.curveLine != null)
            {
                relationLine.curveLine.Stroke = new SolidColorBrush(((SolidColorBrush)relationLine.curveLine.Stroke).Color);
                relationLine.curveLine.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);
            }

            driverCountrol.mainBorder.BorderBrush = new SolidColorBrush(((SolidColorBrush)driverCountrol.mainBorder.BorderBrush).Color);
            driverCountrol.mainBorder.BorderBrush.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }
        */

        private void petalBackground_PreviewMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (!driverCountrol.parentControl.isVisible)
            {
                if (driverCountrol.parentControl.Visibility == Visibility.Hidden)
                {
                    driverCountrol.parentControl.Visibility = Visibility.Visible;
                }
                driverCountrol.parentControl.Show();

                if (relationLine.curveLine == null)
                {
                    //вычисляем с какой стороны от hud ноды находится леписток драйвера и вычисляем позицию элемента таблицы относительно hud ноды
                    double xr = 1000 * Math.Cos(Math.PI * (angel / 6.0) - Math.PI / 2) + parentOWLOSNodeControl.parentControl.transform.X;
                    double yr = 1000 * Math.Sin(Math.PI * (angel / 6.0) - Math.PI / 2) + parentOWLOSNodeControl.parentControl.transform.Y;
                    driverCountrol.parentControl.MoveTransform(xr, yr);

                    relationLine.DrawRelationLine(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color.ToString(), ((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color.ToString());
                }
                relationLine.Show();
            }
            else
            {
                driverCountrol.parentControl.Hide();
                relationLine.Hide();
            }
        }

    }
}
