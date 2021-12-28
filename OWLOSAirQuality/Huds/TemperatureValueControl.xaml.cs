﻿/* ----------------------------------------------------------------------------
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
using OWLOSThingsManager.Ecosystem.OWLOS;
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
    public partial class TemperatureValueControl : UserControl
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
                    SolidColorBrush trapFill = null; 
                    

                    if (!string.IsNullOrEmpty(value))
                    {
                        _Value.Text = value;
                        if (_Value.Text.Length > 5)
                        {
                            _Value.FontSize = 32;
                        }
                        else
                        {
                            _Value.FontSize = 42;
                        }

                        if (!float.IsNaN((float)OriginalValue))
                        {
                            if (!float.IsNaN(LowWarningTrap))
                            {
                                if (OriginalValue <= LowWarningTrap)
                                {
                                    trapFill = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"]).Color);
                                }
                            }

                            if (!float.IsNaN(LowDangerTrap))
                            {
                                if (OriginalValue <= LowDangerTrap)
                                {
                                    trapFill = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"]).Color);
                                }
                            }

                            if (!float.IsNaN(HighWarningTrap))
                            {
                                if (OriginalValue >= HighWarningTrap)
                                {
                                    trapFill = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"]).Color);
                                }
                            }

                            if (!float.IsNaN(HighDangerTrap))
                            {
                                if (OriginalValue >= HighDangerTrap)
                                {
                                    trapFill = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"]).Color);
                                }
                            }
                        }
                        BoxTrapRectangle.Fill = trapFill;
                    }
                    return;                            
                }
                _Value.FontSize = 42;
                _Value.Text = "--";
                Status = NetworkStatus.Offline;
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

        protected float _LowWarningTrap = float.NaN;
        public float LowWarningTrap
        {
            get => _LowWarningTrap;
            set
            {
                _LowWarningTrap = value;
                Value = Value;
            }
        }

        protected float _HighWarningTrap = float.NaN;
        public float HighWarningTrap
        {
            get => _HighWarningTrap;
            set
            {
                _HighWarningTrap = value;
                Value = Value;
            }
        }

        protected float _LowDangerTrap = float.NaN;
        public float LowDangerTrap
        {
            get => _LowDangerTrap;
            set
            {
                _LowDangerTrap = value;
                Value = Value;
            }
        }

        protected float _HighDangerTrap = float.NaN;
        public float HighDangerTrap
        {
            get => _HighDangerTrap;
            set
            {
                _HighDangerTrap = value;
                Value = Value;
            }
        }

        protected bool _Focused = false;
        public bool Focused
        {
            get => _Focused;

            set
            {
                _Focused = value;
                if (_Focused)
                {
                    SelSQ1.Visibility = SelSQ2.Visibility = SelSQ3.Visibility = SelSQ4.Visibility = SelSQ5.Visibility = SelSQ6.Visibility = SelSQ7.Visibility = SelSQ8.Visibility = System.Windows.Visibility.Visible;
                    OnSelect?.Invoke(this, new EventArgs());
                }
                else
                {
                    SelSQ1.Visibility = SelSQ2.Visibility = SelSQ3.Visibility = SelSQ4.Visibility = SelSQ5.Visibility = SelSQ6.Visibility = SelSQ7.Visibility = SelSQ8.Visibility = System.Windows.Visibility.Hidden;
                }

            }
        }

        private bool _DefaultCelsius = true;
        public bool DefaultCelsius
        {
            get => _DefaultCelsius;

            set
            {
                _DefaultCelsius = value;
            }
        }

        private float? _StoredValue = float.NaN;

        private bool _CurentCelsius = true;
        public bool CurentCelsius
        {
            get => _CurentCelsius;

            set
            {
                _CurentCelsius = value;
                if (_CurentCelsius)
                {
                    CurrentUnitOfMesure.Text = "Celsius";
                }
                else
                {
                    CurrentUnitOfMesure.Text = "Fahrenheit";
                }

                SetValue(_StoredValue);
            }
        }

        protected NetworkStatus _Status = NetworkStatus.Offline;
        public NetworkStatus Status
        {
            get => _Status;

            set
            {                                
                _Status = value;

                if (_Value != null)
                {
                    switch (_Status)
                    {
                        case NetworkStatus.Online:
                            _Value.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSLight"]).Color);
                            _StatusText.Background = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSuccessAlpha2"]).Color);
                            _StatusText.Text = "ONLINE";
                            BoxRectangle.Stroke = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSecondary"]).Color);
                            break;
                        case NetworkStatus.Offline:
                            _Value.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color);
                            _StatusText.Background = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"]).Color);
                            _StatusText.Text = "OFFLINE";
                            BoxRectangle.Stroke= new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha3"]).Color);                             
                            break;
                        case NetworkStatus.Reconnect:
                            _Value.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSPrimary"]).Color);
                            _StatusText.Background = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"]).Color);
                            _StatusText.Text = "RECONNECT";
                            BoxRectangle.Stroke = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSecondary"]).Color);
                            break;
                        default:
                            _Value.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color);
                            _StatusText.Background = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"]).Color);
                            _StatusText.Text = "ERROR";
                            BoxRectangle.Stroke = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha1"]).Color);
                            break;
                    }
                }
            }
        }

        protected float? OriginalValue = float.NaN;

        public delegate void OnSelectEventHandler(object? sender, EventArgs e);
        public event OnSelectEventHandler OnSelect;

        public TemperatureValueControl()
        {
            InitializeComponent();
            Status = NetworkStatus.Offline;
        }

        protected void SetValue(float? _OriginalValue)
        {
            _StoredValue = _OriginalValue;

            if ((_OriginalValue != null) && (!float.IsNaN((float)_OriginalValue)))
            {
                

                if (DefaultCelsius && !CurentCelsius)
                {
                    _OriginalValue = (_OriginalValue * (9.0f / 5.0f)) + 32.0f;
                }
                else
                if (!DefaultCelsius && CurentCelsius)
                {
                    _OriginalValue = (_OriginalValue - 32.0f) * (5.0f / 9.0f);
                }

                if ((OriginalValue == null) || (float.IsNaN((float)OriginalValue)))
                {
                    OriginalValue = _OriginalValue;
                    Value = string.Format("{0:0.##}", OriginalValue);
                    Status = NetworkStatus.Online;
                }
                else
                {
                    //Animate color

                    base.Dispatcher.Invoke(() =>
                    {
                        ColorAnimation animation;
                        animation = new ColorAnimation
                        {
                            To = ((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color,
                            Duration = new Duration(TimeSpan.FromSeconds(1)),
                            AutoReverse = true
                        };
                        try
                        {
                            _Value.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSLight"]).Color);
                            _Value.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);
                        }
                        catch { }
                    });

                    //Animate value
                    float step = ((float)_OriginalValue - (float)OriginalValue) / 10.0f;
                    Timer valueTimer = new Timer(100);
                    valueTimer.Elapsed += new ElapsedEventHandler((object source, ElapsedEventArgs e) =>
                    {
                        OriginalValue += step;
                        try
                        {
                            Dispatcher.Invoke(() =>
                            {
                                if (_OriginalValue >= OriginalValue)
                                {
                                    OriginalValue = _OriginalValue;
                                    Value = string.Format("{0:0.##}", OriginalValue);
                                    Status = NetworkStatus.Online;
                                    valueTimer.Stop();
                                    return;
                                }
                                _Value.Text = string.Format("{0:0.##}", OriginalValue);
                            });
                        }
                        catch { }
                    });
                    valueTimer.Start();
                }                                
            }
            else
            {
                Value = "NaN";
                Status = NetworkStatus.Erorr;
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
            Focused = true;
        }

        private void UserControl_LostFocus(object sender, System.Windows.RoutedEventArgs e)
        {
            Focused = false;
        }

        private void UserControl_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            Focused = Focus();
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
                Canvas.SetLeft(BoxTrapRectangle, 6.0f);
                Canvas.SetTop(BoxTrapRectangle, 6.0f);

                BoxTrapRectangle.Width = BoxRectangle.Width = e.NewSize.Width - 6 * 2;
                BoxTrapRectangle.Height = BoxRectangle.Height = e.NewSize.Height - 6 * 2;                

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

        private void CurrentUnitOfMesure_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            CurentCelsius = !CurentCelsius;
        }
    }
}
