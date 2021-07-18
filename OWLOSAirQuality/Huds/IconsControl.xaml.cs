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

        //private double _angle = 0.0f;
        //private readonly double _length = 180.0f;

        //public double angle
        //{
        //    get => _angle;
        //    set
        //    {
        //        if ((value > -1) && (value < 360))
        //        {
        //            _angle = value;
        //            // Draw();
        //        }
        //    }
        //}
        // Текущее значение иконки (Солнце/Облако/Облако с дождем/Дождь)
        private int _state = 1;
        
        public int state
        {
            get => _state;
            set
            {
                if((value>=1) && (value<=4))
                {
                    _state = value;
                    Animate();
                }
            }

        }

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


            DoubleAnimation opacityAnimationFadeIn = new DoubleAnimation()
            {
                From = 1,
                To = 0,
                Duration = new Duration(TimeSpan.FromMilliseconds(10000)),
                AutoReverse = false
            };

            DoubleAnimation opacityAnimationFadeOut = new DoubleAnimation()
            {
                From = 0,
                To = 1,
                Duration = new Duration(TimeSpan.FromMilliseconds(10000)),
                AutoReverse = false
            };


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

            if(state==1)
            {
                story.Children.Add(opacityAnimationFadeOut);
                Storyboard.SetTarget(opacityAnimationFadeOut, Sun);
                Storyboard.SetTargetProperty(opacityAnimationFadeOut, new PropertyPath("Opacity"));
            }
            else
            {
                story.Children.Add(opacityAnimationFadeIn);
                Storyboard.SetTarget(opacityAnimationFadeIn, Sun);
                Storyboard.SetTargetProperty(opacityAnimationFadeIn, new PropertyPath("Opacity"));
            }
            


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

            if(state==2)
            {
                storyClouds.Children.Add(opacityAnimationFadeOut);
                Storyboard.SetTarget(opacityAnimationFadeOut, Clouds);
                Storyboard.SetTargetProperty(opacityAnimationFadeOut, new PropertyPath("Opacity"));
            }
            else
            {
                storyClouds.Children.Add(opacityAnimationFadeIn);
                Storyboard.SetTarget(opacityAnimationFadeIn, Clouds);
                Storyboard.SetTargetProperty(opacityAnimationFadeIn, new PropertyPath("Opacity"));
            }

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

            Storyboard storyCloudy = new Storyboard();
            storyCloudy.Children.Add(rotateAnimationCloudy);
            Storyboard.SetTarget(rotateAnimationCloudy, Cloudy);
            Storyboard.SetTargetProperty(rotateAnimationCloudy, new PropertyPath("(UIElement.RenderTransform).(TransformGroup.Children)[1].(RotateTransform.Angle)"));
           
            if(state==3)
            {
                storyCloudy.Children.Add(opacityAnimationFadeOut);
                Storyboard.SetTarget(opacityAnimationFadeOut, Cloudy);
                Storyboard.SetTargetProperty(opacityAnimationFadeOut, new PropertyPath("Opacity"));
            }
            else
            {
                storyCloudy.Children.Add(opacityAnimationFadeIn);
                Storyboard.SetTarget(opacityAnimationFadeIn, Cloudy);
                Storyboard.SetTargetProperty(opacityAnimationFadeIn, new PropertyPath("Opacity"));
            }

            storyCloudy.Begin();

            // END Cloudy

            /// Stormy begin
            /// 
            TransformGroup transformGroupStormy = new TransformGroup();
            transformGroupStormy.Children.Add(scaleTransform);

            DoubleAnimation rotateAnimationStormy = new DoubleAnimation()
            {
                From = 270,
                To = 630,
                Duration = new Duration(TimeSpan.FromMilliseconds(10000))
            };

            RotateTransform rotateTransformStormy = new RotateTransform();
            rotateTransformStormy.Angle = 90;
            rotateTransformStormy.CenterX = 350;
            rotateTransformStormy.CenterY = 350;

            transformGroupStormy.Children.Add(rotateTransformStormy);
            Stormy.RenderTransform = transformGroupStormy;

            Storyboard storyStormy = new Storyboard();
            storyStormy.Children.Add(rotateAnimationStormy);
            Storyboard.SetTarget(rotateAnimationStormy, Stormy);
            Storyboard.SetTargetProperty(rotateAnimationStormy, new PropertyPath("(UIElement.RenderTransform).(TransformGroup.Children)[1].(RotateTransform.Angle)"));

            if(state==4)
            {
                storyStormy.Children.Add(opacityAnimationFadeOut);
                Storyboard.SetTarget(opacityAnimationFadeOut, Stormy);
                Storyboard.SetTargetProperty(opacityAnimationFadeOut, new PropertyPath("Opacity"));
            }
            else
            {
                storyStormy.Children.Add(opacityAnimationFadeIn);
                Storyboard.SetTarget(opacityAnimationFadeIn, Stormy);
                Storyboard.SetTargetProperty(opacityAnimationFadeIn, new PropertyPath("Opacity"));
            }


            storyStormy.Begin();




            // END Stormy
        }
    }
}
