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
    /// Interaction logic for IconsControl.xaml
    /// </summary>
    public partial class IconsControl : UserControl
    {
        public IconsControl()
        {
            InitializeComponent();
        }

        public void Animate()
        {
            //this.Sun.Children
            //Color currentColor = (this.Sun.Background as SolidColorBrush).Color;
            //Color currentColor = ;
            //int hideStep = 125 / 10;
            //for (int i = 0; i < 10; i++)
            //{
            //    currentColor.A -= (byte)(hideStep);
            //    this.Sun.Background = new SolidColorBrush(currentColor);
            //}
            DoubleAnimation rotateAnimation = new DoubleAnimation()
            {
                From = 0,
                To = 360,
                Duration = new Duration(TimeSpan.FromMilliseconds(5000))
            };

            Sun.RenderTransform = new RotateTransform();
            Sun.RenderTransform.BeginAnimation(RotateTransform.AngleProperty, rotateAnimation);

        }
    }
}
