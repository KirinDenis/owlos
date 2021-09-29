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

using OWLOSEcosystemService.DTO.Things;
using System;
using System.Timers;
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
        public string Caption
        {
            get => _Caption != null ? _Caption.Text : string.Empty;
            set
            {
                if (_Caption != null)
                {
                    _Caption.Text = value;
                }
            }
        }

        public string Value
        {
            get => _Value != null ? _Value.Text : string.Empty;
            set
            {
                if (_Value != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        _Value.Text = value;
                        return;
                    }
                }
                _Value.Text = "--";
            }
        }
        public string UnitOfMeasure
        {
            get => _UnitOfMeasure != null ? _UnitOfMeasure.Text : string.Empty;
            set
            {
                if (_UnitOfMeasure != null)
                {
                    _UnitOfMeasure.Text = value;
                }
            }
        }

        public string Description
        {
            get => _Description != null ? _Description.Text : string.Empty;
            set
            {
                if (_Description != null)
                {
                    _Description.Text = value;
                }
            }
        }

        protected bool _focused = false;

        public bool focused
        {
            get => _focused;

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

        protected float? originalValue = float.NaN;

        public ValueControl()
        {
            InitializeComponent();
        }

        protected void SetValue(float? _originalValue)
        {
            if ((_originalValue != null) && (!float.IsNaN((float)_originalValue)))
            {
                if (float.IsNaN((float)originalValue))
                {
                    Value = originalValue.ToString();
                }
                else
                {
                    //Animate color

                    base.Dispatcher.Invoke(() =>
                    {
                        ColorAnimation animation;
                        animation = new ColorAnimation
                        {
                            To = ((SolidColorBrush)App.Current.Resources["OWLOSLight"]).Color,
                            Duration = new Duration(TimeSpan.FromSeconds(1)),
                            AutoReverse = true
                        };
                        try
                        {
                            _Value.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                            _Value.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);
                        }
                        catch { }
                    });

                    //Animate value
                    float step = ((float)_originalValue - (float)originalValue) / 10.0f;
                    Timer valueTimer = new Timer(100);
                    valueTimer.Elapsed += new ElapsedEventHandler((object source, ElapsedEventArgs e) =>
                    {
                        originalValue += step;
                        try
                        {
                            Dispatcher.Invoke(() =>
                            {
                                if (_originalValue >= originalValue)
                                {
                                    _Value.Text = ((int)_originalValue).ToString();
                                    valueTimer.Stop();
                                    return;
                                }
                                _Value.Text = ((int)_originalValue).ToString();
                            });
                        }
                        catch { }
                    });
                    valueTimer.Start();
                }
                originalValue = _originalValue;
            }
            else
            {
                Value = "NaN";
            }
        }

        public void OnValueChanged(object sender, ValueEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                SetValue(e.value);
            });
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

        private void UserControl_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            try //XAML editor value change can be randomness
            {
                Canvas.SetLeft(BoxRectangle, 6.0f);
                Canvas.SetTop(BoxRectangle, 6.0f);
                BoxRectangle.Width = e.NewSize.Width - 6 * 2;
                BoxRectangle.Height = e.NewSize.Height - 6 * 2;

                SmallBoxRectangle.Width = e.NewSize.Width;
                SmallBoxRectangle.Height = e.NewSize.Height;

                SelSQ3.X1 = e.NewSize.Width + 1;
                SelSQ3.X2 = e.NewSize.Width - 10;

                SelSQ4.X1 = e.NewSize.Width;
                SelSQ4.X2 = e.NewSize.Width;

                SelSQ5.Y1 = e.NewSize.Height;
                SelSQ5.Y2 = e.NewSize.Height;

                SelSQ6.Y1 = e.NewSize.Height;
                SelSQ6.Y2 = e.NewSize.Height - 10;

                SelSQ7.X1 = e.NewSize.Width + 1;
                SelSQ7.X2 = e.NewSize.Width - 10;
                SelSQ7.Y1 = e.NewSize.Height;
                SelSQ7.Y2 = e.NewSize.Height;

                SelSQ8.X1 = e.NewSize.Width;
                SelSQ8.X2 = e.NewSize.Width;
                SelSQ8.Y1 = e.NewSize.Height;
                SelSQ8.Y2 = e.NewSize.Height - 10;

                RSLine1.X1 = e.NewSize.Width - 8;
                RSLine1.X2 = e.NewSize.Width - 8;
                RSLine1.Y1 = e.NewSize.Height - 8;
                RSLine1.Y2 = e.NewSize.Height - 20;

                RSLine2.X1 = e.NewSize.Width - 6;
                RSLine2.X2 = e.NewSize.Width - 20;
                RSLine2.Y1 = e.NewSize.Height - 8;
                RSLine2.Y2 = e.NewSize.Height - 8;

            }
            catch { }
        }
    }
}
