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
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

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
        /// драйвер 
        /// </summary>
        private readonly OWLOSDriver driver = null;

        public OWLOSNodeDriverControl(OWLOSNodeControl parentOWLOSNodeControl, OWLOSDriver driver, double radius, double angel, double length) : base(parentOWLOSNodeControl, radius, angel, length)
        {
            Rotate(angel);
            this.driver = driver;

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

            petalBackground.PreviewMouseLeftButtonDown += petalBackground_PreviewMouseLeftButtonDown;
        }

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
                    double xr = 1000 * Math.Cos(angel * Math.PI / 180 - Math.PI / 2) + parentOWLOSNodeControl.parentControl.transform.X;
                    double yr = 1000 * Math.Sin(angel * Math.PI / 180 - Math.PI / 2) + parentOWLOSNodeControl.parentControl.transform.Y;
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
