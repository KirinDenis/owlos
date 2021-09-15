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
    /// Interaction logic for ValueControl.xaml
    /// </summary>
    public partial class ValueControl : UserControl
    {

        public string value
        {
            get => ValueTextBlock?.Text;
            set
            {
                if (ValueTextBlock?.Text != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        ValueTextBlock.Text = value;
                    }
                    else
                    {
                        ValueTextBlock.Text = "--";
                    }
                }
            }
        }

        public string valueName
        {
            get => NameTextBlock?.Text;
            set
            {
                if (NameTextBlock?.Text != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        NameTextBlock.Text = value;
                    }
                    else
                    {
                        NameTextBlock.Text = "--";
                    }
                }
            }
        }

        public string valueDescription
        {
            get => ValueDescriptionTextBlock?.Text;
            set
            {
                if (ValueDescriptionTextBlock?.Text != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        ValueDescriptionTextBlock.Text = value;
                    }
                    else
                    {
                        ValueDescriptionTextBlock.Text = "--";
                    }
                }
            }
        }

        public string description
        {
            get => DescriptionTextBlock?.Text;
            set
            {
                if (DescriptionTextBlock?.Text != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        DescriptionTextBlock.Text = value;
                    }
                    else
                    {
                        DescriptionTextBlock.Text = "--";
                    }
                }
            }
        }

        protected bool _focused = false;

        public bool focused
        {
            get
            {
                return _focused;
            }

            set
            {
                _focused = value;
                if (_focused)
                {
                    SelSQ1.Visibility = SelSQ2.Visibility = SelSQ3.Visibility = SelSQ4.Visibility = SelSQ5.Visibility = SelSQ6.Visibility = SelSQ7.Visibility = SelSQ8.Visibility = System.Windows.Visibility.Visible;
                }
                else
                {
                    SelSQ1.Visibility = SelSQ2.Visibility = SelSQ3.Visibility = SelSQ4.Visibility = SelSQ5.Visibility = SelSQ6.Visibility = SelSQ7.Visibility = SelSQ8.Visibility = System.Windows.Visibility.Hidden;
                }

            }
        }

        public ValueControl()
        {
            InitializeComponent();
        }

        private void UserControl_GotFocus(object sender, System.Windows.RoutedEventArgs e)
        {
            focused = true;
        }

        private void UserControl_LostFocus(object sender, System.Windows.RoutedEventArgs e)
        {
            focused = false;
        }

        private void UserControl_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            focused = Focus();
        }

        private void UserControl_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha1"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };

            BoxRectangle.Fill = new SolidColorBrush(((SolidColorBrush)Background).Color);
            BoxRectangle.Fill.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        private void UserControl_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = Color.FromArgb(0x01, 0x00, 0x00, 0x00),
                Duration = new Duration(TimeSpan.FromSeconds(2))
            };
            BoxRectangle.Fill = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha1"]).Color);
            BoxRectangle.Fill.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }
    }
}
