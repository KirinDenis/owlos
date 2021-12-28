using OWLOSAdmin.EcosystemExplorer.Huds;
using OWLOSThingsManager.EcosystemExplorer.Huds;
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
    /// Interaction logic for PercentageControl.xaml
    /// </summary>
    public partial class PercentageControl : UserControl
    {
        private double[] _data = null;
        public double[] data
        {
            get => _data;
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

        public double angle
        {
            get => _angle;
            set
            {
                if ((value > -1) && (value < 360))
                {
                    _angle = value;
                    // Draw();
                }
            }
        }

        protected double radius = 0;
        public PercentageControl()
        {
            InitializeComponent();
        }

        public PercentageControl(double radius)
        {
            InitializeComponent();
            this.radius = radius;
        }

        private void Draw()
        {
            double startAngle = angle;
            double endAngle;
            int hideStep = 125 / data.Length;
            PetalControl[] percentPetals = new PetalControl[data.Length];
            Color currentColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
            for (int i = 0; i < data.Length; i++) 
            {
                endAngle = startAngle + data[i] / 100.0f * 360.0f;
                Path p = new Path();
                p.StrokeThickness = 40;
                p.Data = HudLibrary.DrawArc(Gold.center, Gold.center, radius, startAngle, endAngle);
                p.RenderTransformOrigin = new Point(0.5, 0.5);
                p.HorizontalAlignment = HorizontalAlignment.Center;
                p.VerticalAlignment = VerticalAlignment.Center;
                p.Width = 700;
                p.Height = 700;
                //p.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
                currentColor.A -= (byte)(hideStep);
                p.Stroke = new SolidColorBrush(currentColor);
                //var pt = new PathText();
                percentangeMainGrid.Children.Add(p);

                //percentPetals[i] = new PetalControl(radius, 22 + i * 14, 4 * 2, 15, data[i].ToString());
                percentPetals[i] = new PetalControl(radius, (endAngle - startAngle)/2 + startAngle - 12, 10 * 2, 15, data[i].ToString("G4"));
                percentPetals[i].petalBackground.Stroke = null;
                percentPetals[i].petalBorder1.Stroke = null;
                percentPetals[i].petalBorder2.Stroke = null;
                percentPetals[i].petalNameText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                percentangeMainGrid.Children.Add(percentPetals[i]);

                startAngle = endAngle;
            }
        }

    }
}
