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

using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;

namespace OWLOSAirQuality.Huds
{
    /// <summary>
    /// Interaction logic for MenuItemControl.xaml
    /// </summary>
    public partial class MenuItemControl : UserControl
    {
        protected bool _Selected = false;

        public bool Selected
        {
            get => _Selected;

            set
            {
                _Selected = value;
                if (_Selected)
                {
                    Panel parentPanel = (Panel)Parent;
                    foreach (FrameworkElement frameworkElement in parentPanel.Children)
                    {
                        if (frameworkElement == this)
                        {
                            continue;
                        }
                        else
                        if (frameworkElement.GetType() == typeof(MenuItemControl))
                        {
                            (frameworkElement as MenuItemControl).Selected = false;
                        }
                    }

                    SelSQ1.Visibility = SelSQ2.Visibility = SelSQ3.Visibility = SelSQ4.Visibility = SelSQ5.Visibility = SelSQ6.Visibility = System.Windows.Visibility.Visible;
                    _Caption.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSLight"]).Color);
                    OnSelect?.Invoke(this, new EventArgs());
                }
                else
                {
                    SelSQ1.Visibility = SelSQ2.Visibility = SelSQ3.Visibility = SelSQ4.Visibility = SelSQ5.Visibility = SelSQ6.Visibility = System.Windows.Visibility.Hidden;
                    _Caption.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color);
                }
            }
        }
        public string Caption
        {
            get
            {
                if (_Caption != null)
                {
                    return _Caption.Text;
                }
                else
                {
                    return string.Empty;
                }
            }

            set
            {
                if (_Caption != null)
                {
                    _Caption.Text = value;
                }
            }
        }
        public string Description
        {
            get
            {
                if (_Description != null)
                {
                    return _Description.Text;
                }
                else
                {
                    return string.Empty;
                }
            }

            set
            {
                if (_Description != null)
                {
                    _Description.Text = value;
                }
            }
        }

        public delegate void OnSelectEventHandler(object? sender, EventArgs e);
        public event OnSelectEventHandler OnSelect;

        public MenuItemControl()
        {
            InitializeComponent();
        }

        private void UserControl_GotFocus(object sender, System.Windows.RoutedEventArgs e)
        {
            Selected = true;
        }

        private void UserControl_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            Selected = Focus();
        }

        private void UserControl_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha1"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };

            BoxRectangle.Background = new SolidColorBrush(((SolidColorBrush)Background).Color);
            BoxRectangle.Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        private void UserControl_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = Color.FromArgb(0x01, 0x00, 0x00, 0x00),
                Duration = new Duration(TimeSpan.FromSeconds(2))
            };
            BoxRectangle.Background = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha1"]).Color);
            BoxRectangle.Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

    }
}
