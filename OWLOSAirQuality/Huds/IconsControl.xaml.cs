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
        // Текущее значение иконки (Солнце/Облако/Облако с дождем/Дождь)
        private int _state { get; set; }
        
        public int From { get; set; }
        public int To { get; set; }

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
            TransformGroup transformGroup = new TransformGroup();

            ScaleTransform scaleTransform = new ScaleTransform();
            scaleTransform.ScaleX = 0.3;
            scaleTransform.ScaleY = 0.3;
            //scaleTransform.CenterX = 350;
            //scaleTransform.CenterY = 350;
            scaleTransform.CenterX = 525;
            scaleTransform.CenterY = 525;
            transformGroup.Children.Add(scaleTransform);

            DoubleAnimation rotateAnimation = new DoubleAnimation()
            {
                From = 0,
                To = 360,                
                Duration = new Duration(TimeSpan.FromMilliseconds(10000))
            };

            RotateTransform rotateTransform = new RotateTransform();
            rotateTransform.Angle = 180;
            rotateTransform.CenterX = 350;
            rotateTransform.CenterY = 350;
            transformGroup.Children.Add(rotateTransform);

            //Sun.RenderTransform = rotateTransform;
            Sun.RenderTransform = transformGroup;
            //Sun.Visibility = Visibility.Hidden;

            Storyboard story = new Storyboard();
            story.Children.Add(rotateAnimation);
            Storyboard.SetTarget(rotateAnimation, Sun);
            Storyboard.SetTargetProperty(rotateAnimation, new PropertyPath("(UIElement.RenderTransform).(TransformGroup.Children)[1].(RotateTransform.Angle)"));
            story.Begin();

            TransformGroup transformGroupClouds = new TransformGroup();
            transformGroupClouds.Children.Add(scaleTransform);

            DoubleAnimation rotateAnimationClouds = new DoubleAnimation()
            {
                From = 90,
                To = 450,
                Duration = new Duration(TimeSpan.FromMilliseconds(10000))
            };

            RotateTransform rotateTransformClouds = new RotateTransform();
            rotateTransformClouds.Angle = 45;
            rotateTransformClouds.CenterX = 350;
            rotateTransformClouds.CenterY = 350;

            transformGroupClouds.Children.Add(rotateTransformClouds);
            Clouds.RenderTransform = transformGroupClouds;

            Storyboard storyClouds = new Storyboard();
            storyClouds.Children.Add(rotateAnimationClouds);
            Storyboard.SetTarget(rotateAnimationClouds, Clouds);
            Storyboard.SetTargetProperty(rotateAnimationClouds, new PropertyPath("(UIElement.RenderTransform).(TransformGroup.Children)[1].(RotateTransform.Angle)"));
            storyClouds.Begin();

            //Sun.RenderTransform.BeginAnimation(RotateTransform.AngleProperty, rotateAnimation);

            // Cloudy
            TransformGroup transformGroupCloudy = new TransformGroup();
            transformGroupCloudy.Children.Add(scaleTransform);

            DoubleAnimation rotateAnimationCloudy = new DoubleAnimation()
            {
                From = 180,
                To = 540,
                Duration = new Duration(TimeSpan.FromMilliseconds(10000))
            };

            RotateTransform rotateTransformCloudy = new RotateTransform();
            rotateTransformCloudy.Angle = 90;
            rotateTransformCloudy.CenterX = 350;
            rotateTransformCloudy.CenterY = 350;

            transformGroupCloudy.Children.Add(rotateTransformCloudy);
            Cloudy.RenderTransform = transformGroupCloudy;

            DoubleAnimation opacityAnimationCloudy = new DoubleAnimation()
            {
                From = 1,
                To = 0,
                Duration = new Duration(TimeSpan.FromMilliseconds(10000)),
                AutoReverse = false
            };

            Storyboard storyCloudy = new Storyboard();
            storyCloudy.Children.Add(rotateAnimationCloudy);
            Storyboard.SetTarget(rotateAnimationCloudy, Cloudy);
            Storyboard.SetTargetProperty(rotateAnimationCloudy, new PropertyPath("(UIElement.RenderTransform).(TransformGroup.Children)[1].(RotateTransform.Angle)"));
            Storyboard.SetTarget(opacityAnimationCloudy, Cloudy);
            Storyboard.SetTargetProperty(opacityAnimationCloudy, new PropertyPath("(UIElement.RenderTransform).(TransformGroup.Children)[1].(Brush.Opacity)"));

            storyCloudy.Begin();

            

            // END Cloudy
        }
    }
}
