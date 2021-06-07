using OWLOSAdmin.EcosystemExplorer.Huds;
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
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    /// <summary>
    /// Interaction logic for GraphControl.xaml
    /// </summary>
    public partial class GraphControl : UserControl
    {
        public GraphControl(double[] data)
        {
            InitializeComponent();

            /*
              x = xTransform +  offsetX;  
              y = yTransform +  offsetY;  
             
              x = r * cos(a) + offsetX;  
              y = r * sin(a) + offsetY;  
            */
            double angel = 0.0f;
            Color currentColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
            for (int i = 0; i < data.Length; i++)
            {
                Rectangle r = new Rectangle();
                r.Width = 20;
                r.Height = data[i];
                r.HorizontalAlignment = HorizontalAlignment.Center;
                r.VerticalAlignment = VerticalAlignment.Center;

                currentColor.A -= (byte)(i * 5);
                r.Fill = new SolidColorBrush(currentColor);

                double x ;
                double y ;

                angel += Math.PI / 20.0f;

                x = 200 * Math.Cos(angel) ;
                y = 200 * Math.Sin(angel) ;

                TransformGroup group = new TransformGroup();

                RotateTransform rt = new RotateTransform();

                TranslateTransform tt = new TranslateTransform
                {
                    X = x,
                    Y = y
                };

                group.Children.Add(rt);
                group.Children.Add(tt);

                rt.Angle += 97.0f;

                r.RenderTransform = group;
                

                /*
                RotateTransform rotateTransform = new RotateTransform
                {
                    Angle = angel
                };
                r.RenderTransform = rotateTransform;

               
                r.Margin = new Thickness(x, y,0,0);
                */



                GraphGrid.Children.Add(r);
            }
        }
    }
}
