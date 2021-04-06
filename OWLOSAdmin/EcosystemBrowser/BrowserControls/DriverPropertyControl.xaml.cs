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

using OWLOSAdmin.Ecosystem.OWLOS;
using OWLOSAdmin.EcosystemExplorer.Huds;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{

    //flags started with "//" chars at end of the string:
    //r - read only
    //s - selected
    //p - password
    //
    //b - boolean
    //f - float
    //i - integer
    //if no type = string
    //if not read only - write accessable
    //this flags needed to UI and SDK builder - determinate API parameters types and SET API available
    public class PropertyFlags
    {
        public bool isReadOnly = false;
        public bool isSelected = false;
        public bool isPassword = false;
        public bool isBoolean = false;
        public bool isFloat = false;
        public bool isInteger = false;

        public PropertyFlags(string flags)
        {
            if (string.IsNullOrEmpty(flags))
            {
                return;
            }
            flags = flags.ToLower();
            if (flags.IndexOf("r") != -1)
            {
                isReadOnly = true;
            }
            if (flags.IndexOf("s") != -1)
            {
                isSelected = true;
            }
            if (flags.IndexOf("p") != -1)
            {
                isPassword = true;
            }
            if (flags.IndexOf("b") != -1)
            {
                isBoolean = true;
            }
            if (flags.IndexOf("f") != -1)
            {
                isFloat = true;
            }
            if (flags.IndexOf("i") != -1)
            {
                isInteger = true;
            }
        }
    }



    /// <summary>
    /// Interaction logic for DriverPropertyControl.xaml
    /// </summary>
    public partial class DriverPropertyControl : UserControl
    {
        public int valueLength = 20;

        public PropertyFlags flags = null;

        private readonly DoubleAnimation spinnerRotate;

        private readonly List<string> TimePropertiesNames = new List<string> { "lastquerymillis", "lastpublishmillis", "queryinterval", "publishinterval" };

        public OWLOSDriverProperty DriverProperty;
        public DriverPropertyControl(OWLOSDriverProperty DriverProperty)
        {
            InitializeComponent();

            this.DriverProperty = DriverProperty;

            flags = new PropertyFlags(DriverProperty.flags);

            //Name setup by flags
            propName.Text = DriverProperty.name;

            ValueToEditors();

            if (flags.isSelected)
            {
                propName.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                propValue.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
            }
            else
            {
                propName.Foreground = SystemColors.InfoTextBrush;
                propValue.Foreground = SystemColors.InfoTextBrush;
            }

            DriverProperty.OnPropertyChange += Property_ChangeProperty;
            DriverProperty.OnPropertyTransportStatusChange += Property_OnPropertyTransportStatusChange;

            propSpinner.Data = HudLibrary.DrawArc(10, 10, 7, 1, 240);

            spinnerRotate = new DoubleAnimation
            {
                From = 0.0f,
                To = 360,
                Duration = new Duration(TimeSpan.FromMilliseconds(1000)),
                RepeatBehavior = RepeatBehavior.Forever
                // EasingFunction = new BackEase()                
            };

            propSpinner.RenderTransform = new RotateTransform();

        }

        private void Property_OnPropertyTransportStatusChange(object sender, OWLOSPropertyWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                Brush componentsBrush = SystemColors.InfoTextBrush; // (SolidColorBrush)App.Current.Resources["OWLOSInfo"]; //default NetworkStatus.online
                EnableValueEditors();

                if (e.property.networkStatus == NetworkStatus.Erorr)
                {
                    componentsBrush = (SolidColorBrush)App.Current.Resources["OWLOSDanger"];
                }
                else
            if (e.property.networkStatus == NetworkStatus.Reconnect)
                {
                    componentsBrush = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
                    DisableValueEditors();
                }
                else
            if (e.property.networkStatus == NetworkStatus.Offline)
                {
                    componentsBrush = SystemColors.GrayTextBrush;// (SolidColorBrush)App.Current.Resources["OWLOSDark"];
                }

                propValueEdit.BorderBrush = propPasswordValueEdit.BorderBrush = propCheckBoxValueEdit.BorderBrush =
                setButton.BorderBrush = setButton.Foreground = getButton.BorderBrush = getButton.Foreground = componentsBrush;
            });
        }

        private void DisableValueEditors()
        {
            propValueEdit.IsEnabled = propPasswordValueEdit.IsEnabled = propCheckBoxValueEdit.IsEnabled = setButton.IsEnabled = getButton.IsEnabled = false;
            propSpinner.Visibility = Visibility.Visible;
            propSpinner.RenderTransform.BeginAnimation(RotateTransform.AngleProperty, spinnerRotate);
        }

        private void EnableValueEditors()
        {
            propValueEdit.IsEnabled = propPasswordValueEdit.IsEnabled = propCheckBoxValueEdit.IsEnabled = setButton.IsEnabled = getButton.IsEnabled = true;
            propSpinner.Visibility = Visibility.Hidden;
            propSpinner.RenderTransform.BeginAnimation(RotateTransform.AngleProperty, null);
        }

        private void ValueToEditors()
        {

            //Value viewer setup             
            if (!flags.isPassword)
            {
                if ((TimePropertiesNames.IndexOf(DriverProperty.name) != -1) && long.TryParse(DriverProperty.value, out long longValue))
                {
                    TimeSpan timeSpan = TimeSpan.FromMilliseconds(longValue);
                    propValue.Text = string.Format("{0:D2}:{1:D2}:{2:D2}.{3:D3}ms", timeSpan.Hours, timeSpan.Minutes, timeSpan.Seconds, timeSpan.Milliseconds);
                }
                else
                {

                    if ((float.TryParse(DriverProperty.value, out float floatValue)) && (float.TryParse(propValue.Text, out float currentValue)))
                    {

                        if (floatValue == currentValue)
                        {
                            propValue.Text = DriverProperty.value;
                        }
                        else
                        {
                            float step = (floatValue - currentValue) / 10;
                            Timer valueTimer = new Timer(100);
                            valueTimer.Elapsed += new ElapsedEventHandler((object source, ElapsedEventArgs e) =>
                            {
                                currentValue += step;
                                try
                                {

                                    Dispatcher.Invoke(() =>
                                    {
                                        if (currentValue >= floatValue)
                                        {
                                            propValue.Text = ((int)floatValue).ToString();
                                            valueTimer.Stop();
                                            return;
                                        }
                                        propValue.Text = ((int)currentValue).ToString();
                                    });
                                }
                                catch { }
                            });
                            valueTimer.Start();
                        }
                    }

                    else
                    {
                        propValue.Text = CutValue(DriverProperty.value);
                    }
                }
            }
            else
            {
                propValue.Text = new string('*', DriverProperty.value.Length);
            }

            //Value editor serup
            if (!flags.isReadOnly)
            {
                setButton.Visibility = Visibility.Visible;
                if (flags.isPassword)
                {
                    propPasswordValueEdit.Visibility = Visibility.Visible;
                    propPasswordValueEdit.Password = DriverProperty.value;
                }
                else
                if (flags.isBoolean)
                {
                    propCheckBoxValueEdit.Visibility = Visibility.Visible;
                    //don't use boolean string formaters
                    if ((DriverProperty.value.ToLower().Equals("true")) || (DriverProperty.value.ToLower().Equals("1")))
                    {
                        propCheckBoxValueEdit.IsChecked = true;
                    }
                }
                else //string, float or integer
                {
                    propValueEdit.Visibility = Visibility.Visible;
                    propValueEdit.Text = DriverProperty.value;
                    if (flags.isFloat)
                    {
                        propValueEdit.PreviewTextInput += PropValueEdit_PreviewFloatTextInput;
                    }
                    else
                    if (flags.isInteger)
                    {
                        propValueEdit.PreviewTextInput += PropValueEdit_PreviewIntegerTextInput;
                    }
                }
            }
        }

        private void PropValueEdit_PreviewFloatTextInput(object sender, TextCompositionEventArgs e)
        {
            Regex regex = new Regex("[^0-9.-]+");
            e.Handled = regex.IsMatch(e.Text);
        }
        private void PropValueEdit_PreviewIntegerTextInput(object sender, TextCompositionEventArgs e)
        {
            Regex regex = new Regex("[^0-9-]+");
            e.Handled = regex.IsMatch(e.Text);
        }


        private string CutValue(string _value)
        {
            if (_value.Length > valueLength)
            {
                _value = _value.Substring(0, valueLength - 3) + "...";
            }
            return _value;
        }

        private void Property_ChangeProperty(object sender, OWLOSPropertyWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                ValueToEditors();

                ColorAnimation animation;
                animation = new ColorAnimation
                {
                    To = ((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color,
                    Duration = new Duration(TimeSpan.FromSeconds(1)),
                    AutoReverse = true
                };
                try
                {
                    if (flags.isSelected)
                    {
                        propValue.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                    }
                    else
                    {
                        propValue.Foreground = SystemColors.InfoTextBrush; //new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color);
                    }
                    propValue.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);
                }
                catch { }
            });
        }

        private void getButton_Click(object sender, RoutedEventArgs e)
        {
            DriverProperty.GetOutside();
        }

        private void setButton_Click(object sender, RoutedEventArgs e)
        {
            DriverProperty.SetInside(propValueEdit.Text);
        }

    }
}
