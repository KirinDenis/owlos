using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

namespace OWLOSAirQuality.Huds
{
    /// <summary>
    /// Interaction logic for SelectFrameControl.xaml
    /// </summary>
    public partial class SelectFrameControl : UserControl
    {
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

        public SelectFrameControl()
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
