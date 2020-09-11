using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
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
    /// <summary>
    /// Interaction logic for ArcPathControl.xaml
    /// </summary>
    public partial class ArcPathControl : UserControl
    {

        private double radius = 70;
        private double angel1 = 0;

        public ArcPathControl()
        {
            InitializeComponent();

            path1.Data = Geometry.Parse(describeArc(100, 100, radius, 30, 180));
            path2.Data = Geometry.Parse(describeArc(100, 100, radius, 30, 180));
            path3.Data = Geometry.Parse(describeArc(100, 100, radius + 10, 30, 180));
            path4.Data = Geometry.Parse(describeArc(100, 100, radius - 50, 0, 359));
            path5.Data = Geometry.Parse(describeArc(100, 100, radius + 20, 0, 30));


            Random r = new Random((int)DateTime.Now.Ticks);

            DoubleAnimation rotate = new DoubleAnimation
            {
                From = 0.0f,
                To = r.Next(100, 1000),
                Duration = new Duration(TimeSpan.FromMilliseconds(r.Next(5000, 100000))),
                RepeatBehavior = RepeatBehavior.Forever,
                EasingFunction = new BackEase()
                //AutoReverse = true
            };
            DoubleAnimation rotate2 = new DoubleAnimation(r.Next(100, 1000), 0.0f, new Duration(TimeSpan.FromMilliseconds(r.Next(5000, 100000))));

            DoubleAnimation rotate3 = new DoubleAnimation
            {
                From = -r.Next(100, 1000),
                To = 0.0f,
                Duration = new Duration(TimeSpan.FromMilliseconds(20000)),
                RepeatBehavior = RepeatBehavior.Forever,
                EasingFunction = new BackEase()
                //AutoReverse = true
            };


            RotateTransform rotateTransform = new RotateTransform();

            path1.RenderTransform = rotateTransform;
            path2.RenderTransform = rotateTransform;
            path3.RenderTransform = rotateTransform;


            rotateTransform.BeginAnimation(RotateTransform.AngleProperty, rotate);

            RotateTransform rotateTransform2 = new RotateTransform();
            path4.RenderTransform = rotateTransform2;
            text1.LayoutTransform = rotateTransform2;

            rotateTransform2.BeginAnimation(RotateTransform.AngleProperty, rotate2);


            RotateTransform rotateTransform3 = new RotateTransform();
            path5.RenderTransform = rotateTransform3;



            rotateTransform3.BeginAnimation(RotateTransform.AngleProperty, rotate3);


            Timer lifeCycleTimer = new Timer(1000);
            lifeCycleTimer.AutoReset = true;
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();
            OnLifeCycleTimer(null, null);


        }

        private async void OnLifeCycleTimer(Object source, ElapsedEventArgs e)
        {
            angel1 += 10;
            if (angel1 > 195)
            {
                angel1 = 0;
            }

            this.Dispatcher.Invoke(() =>
            {


                path2.Data = Geometry.Parse(describeArc(100, 100, radius, 0, angel1));
            });
        }


        private Point polarToCartesian(double centerX, double centerY, double radius, double angleInDegrees)
        {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

            Point point = new Point(centerX + (radius * Math.Cos(angleInRadians)), centerY + (radius * Math.Sin(angleInRadians)));

            return point;
        }

        private string describeArc(double x, double y, double radius, double startAngle, double endAngle)
        {

            Point start = polarToCartesian(x, y, radius, endAngle);
            Point end = polarToCartesian(x, y, radius, startAngle);

            int largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";

            return string.Join(" ", new string[11] { "M", start.X.ToString(nfi), start.Y.ToString(nfi), "A", radius.ToString(nfi), radius.ToString(nfi), "0", largeArcFlag.ToString(nfi), "0", end.X.ToString(nfi), end.Y.ToString(nfi) });
        }

        private void path5_MouseEnter(object sender, MouseEventArgs e)
        {
            path5.StrokeThickness = 200;
        }

        private void path5_MouseLeave(object sender, MouseEventArgs e)
        {
            path5.StrokeThickness = 3;
        }

    }
}
