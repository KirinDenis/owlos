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
    /// Наружный лепесток с сетевым состоянием
    /// </summary>
    public partial class OWLOSNodeTransportControl : OWLOSPetalControl
    {
        /// <summary>
        /// элемент - таблица со свойствами драйвера 
        /// </summary>
        private readonly OWLOSTransportControl transportCountrol = null;

        /// <summary>
        /// драйвер 
        /// </summary>
        private readonly IOWLOSTransport transport;

        public OWLOSNodeTransportControl(OWLOSNodeControl parentOWLOSNodeControl, IOWLOSTransport transport, double radius, double angel, double length, double width) : base(parentOWLOSNodeControl, radius, angel, length, width)
        {
            Rotate(angel);
            this.transport = transport;

            transport.OnTransportStatusChanger += OnTransportStatusChanger;
            
            transportCountrol = new OWLOSTransportControl(transport);
            transportCountrol.parentControl.Visibility = Visibility.Hidden;
            transportCountrol.parentControl.Hide();

            //контролируем родительский элемент (hud ноды) если он начнем перемещатся по экосистеме
            //перерисуем соединительную линию
            (parentOWLOSNodeControl.parentControl.Parent as Grid).Children.Add(transportCountrol.parentControl);

            //Название драйвера, смотрите UserControl_Loaded - пересчет извиба надписи
            petalNameText.Text = transport.connection.name;

            //создаем и настраиваем соеденительную линию
            relationLine = new EcosystemRelationLine(transportCountrol, transportCountrol.parentControl, connector, transportCountrol, parentOWLOSNodeControl.parentControl.Parent as Grid);

            petalBackground.PreviewMouseLeftButtonDown += petalBackground_PreviewMouseLeftButtonDown;
        }

        private void OnTransportStatusChanger(object sender, NetworkStatus e)
        {
                base.Dispatcher.Invoke(() =>
                {
                    OWLOSTransport transport = sender as OWLOSTransport;


                        switch (e)
                        {
                            case NetworkStatus.Online:
                                Rotate(angel);
                                break;
                            case NetworkStatus.Offline:
                                Rotate(90 + angel);
                                break;

                            case NetworkStatus.Reconnect:
                                Rotate(180 + angel);
                                break;

                            case NetworkStatus.Erorr:
                                Rotate(270 + angel);
                                break;
                        }

                    this.UpdateLayout();

                    if (relationLine?.curveLine != null)
                    {
                        relationLine?.UpdatePositions();
                    }

                });


        }

        private void petalBackground_PreviewMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            
            if (!transportCountrol.parentControl.isVisible)
            {
                if (transportCountrol.parentControl.Visibility == Visibility.Hidden)
                {
                    transportCountrol.parentControl.Visibility = Visibility.Visible;
                }
                transportCountrol.parentControl.Show();

                if (relationLine.curveLine == null)
                {
                    //вычисляем с какой стороны от hud ноды находится леписток драйвера и вычисляем позицию элемента таблицы относительно hud ноды
                    double xr = 700 * Math.Cos(angel * Math.PI / 180 - Math.PI / 2) + parentOWLOSNodeControl.parentControl.transform.X;
                    double yr = 700 * Math.Sin(angel * Math.PI / 180 - Math.PI / 2) + parentOWLOSNodeControl.parentControl.transform.Y;
                    transportCountrol.parentControl.MoveTransform(xr, yr);

                    relationLine.DrawRelationLine(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color.ToString(), ((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color.ToString());
                }
                relationLine.Show();
            }
            else
            {
                transportCountrol.parentControl.Hide();
                relationLine.Hide();
            }
            
        }
    }
}
