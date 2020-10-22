using OWLOSAdmin.Ecosystem.OWLOS;
using OWLOSAdmin.EcosystemExplorer.Huds;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemExplorer
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
            if (flags.IndexOf("r") != -1 )
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
    /// Interaction logic for OWLOSDriverPropertyControl.xaml
    /// </summary>
    public partial class OWLOSDriverPropertyControl : UserControl
    {
        public int valueLength = 20;

        public PropertyFlags flags = null;


        private OWLOSDriverProperty property;

        private DoubleAnimation spinnerRotate;
        public OWLOSDriverPropertyControl(OWLOSDriverProperty property)
        {
            InitializeComponent();

            this.property = property;
            flags = new PropertyFlags(property.flags);

            //Name setup by flags
            propName.Text = property.name;

            ValueToEditors();

            if (flags.isSelected)
            {
                propName.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                propValue.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
            }
            else
            {
                propName.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
                propValue.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
            }

            property.OnPropertyChange += Property_ChangeProperty;
            property.OnPropertyTransportStatusChange += Property_OnPropertyTransportStatusChange;

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
                Brush componentsBrush = (SolidColorBrush)App.Current.Resources["OWLOSInfo"]; //default NetworkStatus.online
                EnableValueEditors();

                if (e.property.networkStatus == NetworkStatus.erorr)
                {
                    componentsBrush = (SolidColorBrush)App.Current.Resources["OWLOSDanger"];
                }
                else
            if (e.property.networkStatus == NetworkStatus.reconnect)
                {
                    componentsBrush = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
                    DisableValueEditors();
                }
                else
            if (e.property.networkStatus == NetworkStatus.offline)
                {
                    componentsBrush = (SolidColorBrush)App.Current.Resources["OWLOSDark"];
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
                float floatValue = 0;
                float currentValue = 0;
                if ((float.TryParse(property.value, out floatValue)) && (float.TryParse(propValue.Text, out currentValue)))
                {
                    if (floatValue == currentValue)
                    {
                        propValue.Text = property.value;
                    }
                    else
                    {
                        float step = (floatValue - currentValue) / 10;
                        Timer valueTimer = new Timer(100);
                        valueTimer.Elapsed += new ElapsedEventHandler((Object source, ElapsedEventArgs e) =>
                        {
                            currentValue += step;
                            try
                            {

                                this.Dispatcher.Invoke(() =>
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
                    propValue.Text = CutValue(property.value);
                }
            }
            else
            {
                propValue.Text = new string('*', property.value.Length);
            }

            //Value editor serup
            if (!flags.isReadOnly)
            {
                setButton.Visibility = Visibility.Visible;
                if (flags.isPassword)
                {
                    propPasswordValueEdit.Visibility = Visibility.Visible;
                    propPasswordValueEdit.Password = property.value;
                }
                else
                if (flags.isBoolean)
                {
                    propCheckBoxValueEdit.Visibility = Visibility.Visible;
                    //don't use boolean string formaters
                    if ((property.value.ToLower().Equals("true")) || (property.value.ToLower().Equals("1")))
                    {
                        propCheckBoxValueEdit.IsChecked = true;
                    }
                }
                else //string, float or integer
                {
                    propValueEdit.Visibility = Visibility.Visible;
                    propValueEdit.Text = property.value;
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
                animation = new ColorAnimation();             
                animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color;
                animation.Duration = new Duration(TimeSpan.FromSeconds(1));
                animation.AutoReverse = true;
                try
                {
                    if (flags.isSelected)
                    {
                        propValue.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                    }
                    else
                    {
                        propValue.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color);
                    }
                    propValue.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);
                }
                catch { }
            });
        }

        private void getButton_Click(object sender, RoutedEventArgs e)
        {
            property.GetOutside();
        }

        private void setButton_Click(object sender, RoutedEventArgs e)
        {
            property.SetInside(propValueEdit.Text);
        }
    }
}
