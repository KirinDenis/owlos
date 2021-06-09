using OWLOSAdmin.EcosystemExplorer.Huds;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    /// <summary>
    /// Interaction logic for GraphControl.xaml
    /// </summary>
    public partial class GraphControl : UserControl
    {
        private double[] _data = null;
        public double[] data
        {
            get { return _data; }
            set
            {
                if ((value != null) && (value.Length > 0))
                {
                    _data = value;
                    Draw();
                }
            }
        }

        private double _angle = 0.0f;
        private double _length = 180.0f;

        public double angle
        {
            get { return _angle; }
            set 
            { 
                if ((value > -1) && (value < 360))
                {
                    _angle = value;
                    Draw();
                }
            }
        }


        public GraphControl()
        {
            InitializeComponent();            
        }

        private void Draw()
        {
            /*
              x = xTransform +  offsetX;  
              y = yTransform +  offsetY;  
             
              x = r * cos(a) + offsetX;  
              y = r * sin(a) + offsetY;  
            */


            GraphGrid.Children.Clear();

            Random rnd = new Random();

            double angel = 0.0f;
            Color currentColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
            for (int i = 0; i < data.Length; i++)
            {

                //currentColor.R -= (byte)rnd.Next(100);
                //currentColor.G -= (byte)rnd.Next(100);
                //currentColor.B -= (byte)rnd.Next(100);
                //currentColor.A = 100;

                Rectangle r = new Rectangle
                {
                    Width = 10,
                    Height = data[i],
                    HorizontalAlignment = HorizontalAlignment.Center,
                    VerticalAlignment = VerticalAlignment.Center,

                    //currentColor.A -= (byte)(i * 5);
                    Fill = new SolidColorBrush(currentColor)
                };

                double x;
                double y;

                angel = (i + _angle) * (Math.PI / 80) - Math.PI / 2.0f;

                x = (Gold.radius + data[i] / 2.0f + 30.0f) * Math.Cos(angel) + 5.0f;
                y = (Gold.radius + data[i] / 2.0f + 30.0f) * Math.Sin(angel) + 10.0f;

                TransformGroup group = new TransformGroup();

                RotateTransform rt = new RotateTransform();

                TranslateTransform tt = new TranslateTransform
                {
                    X = x,
                    Y = y
                };



                DoubleAnimation scaleAnimation = new DoubleAnimation()
                {
                    From = 0.0,
                    To = -rnd.NextDouble() * 2.0f,
                    Duration = new Duration(TimeSpan.FromMilliseconds(rnd.Next(5000))),
                    AutoReverse = true,
                    RepeatBehavior = RepeatBehavior.Forever
                };

                //ScaleTransform sc = new ScaleTransform();
                //sc.BeginAnimation(ScaleTransform.ScaleYProperty, scaleAnimation);


                //group.Children.Add(sc);
                group.Children.Add(rt);
                group.Children.Add(tt);
                rt.Angle += (angel / (Math.PI / 180.0f)) + 90.0f;

                r.RenderTransform = group;


                GraphGrid.Children.Add(r);

            }
        }
    }
}
