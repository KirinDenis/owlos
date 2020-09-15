using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.EcosystemExplorer.Huds;
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
    /// Interaction logic for OWLOSNodeControl.xaml
    /// </summary>
    public partial class OWLOSNodeControl: UserControl, IEcosystemChildControl
    {

        public EcosystemControl parentControl { get; set; }

        private double radius = 70;
        private double angel1 = 0;

        private OWLOSNodeWrapper nodeWrapper;

        public OWLOSNodeControl(OWLOSNodeWrapper nodeWrapper)
        {

            this.nodeWrapper = nodeWrapper;
            if (nodeWrapper != null)
            {
                nodeWrapper.node.OnNewDriver += Node_OnNewDriver;
            }

            InitializeComponent();

            parentControl = new EcosystemControl(this);

            path1.Data = HudLibrary.DrawArc(100, 100, radius, 30, 180);
            path2.Data = HudLibrary.DrawArc(100, 100, radius, 30, 180);
            path3.Data = HudLibrary.DrawArc(100, 100, radius + 10, 30, 180);
            path4.Data = HudLibrary.DrawArc(100, 100, radius - 50, 0, 359);
            path5.Data = HudLibrary.DrawArc(100, 100, radius + 20, 0, 30);


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

        private void Node_OnNewDriver(object sender, Ecosystem.OWLOS.OWLOSDriverWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                 OWLOSDriverPropControl driverCountrol = new OWLOSDriverPropControl(e.driver);
                 (this.parentControl.Parent as Grid).Children.Add(driverCountrol.parentControl);



                var relationLine = new EcosystemRelationLine(driverCountrol, driverCountrol.parentControl, this.parentControl, driverCountrol, this.parentControl.Parent as Grid);
                relationLine.DrawRelationLine();

                //driversControl.Text = "";
                //driversControl.Text = driversControl.Text + e.driver.name + "\n";
                //e.driver.NewProperty += Driver_NewProperty;
            });

        }

        public void OnParentDrag()
        {
            
        }

        public void OnParentDrop()
        {
            
        }

        public void OnParentGetFocus()
        {
            
        }

        public void OnParentLostFocus()
        {
            
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


                path2.Data = HudLibrary.DrawArc(100, 100, radius, 0, angel1);
            });
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
