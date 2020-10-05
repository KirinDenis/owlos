using OWLOSAdmin.Ecosystem.OWLOS;
using OWLOSAdmin.EcosystemExplorer.Huds;
using System;
using System.Collections.Generic;
using System.Text;
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
using PathText;

namespace OWLOSAdmin.EcosystemExplorer.EcosystemControls
{

    /// <summary>
    /// Interaction logic for OWLOSNodeDriverControl.xaml
    /// </summary>
    public partial class OWLOSNodeDriverControl : UserControl
    {
        private OWLOSDriverControl driverCountrol = null;
        private OWLOSNodeControl parentOWLOSNodeControl;

        private EcosystemControl connector = new EcosystemControl(null);

        private EcosystemRelationLine relationLine = null;

        private OWLOSDriver driver = null;

        private bool controlLeave = true;

        private double radius = 0;
        private double angel = 0;
        public OWLOSNodeDriverControl(OWLOSNodeControl parentOWLOSNodeControl, OWLOSDriver driver, double radius, double angel)
        {
            InitializeComponent();

            this.driver = driver;

            this.radius = radius;
            this.angel = angel;

            connector.MoveTransform(0, 0);
            connector.Width = 10;
            connector.Height = 10;
            connector.HorizontalAlignment = HorizontalAlignment.Center;
            connector.VerticalAlignment = VerticalAlignment.Top;
            connector.Margin = new Thickness(0, 0, 0, 0);

            connector.Background = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];

            text2.Children.Add(connector);

            this.parentOWLOSNodeControl = parentOWLOSNodeControl;

            double _angel = 0;
            pathL1.Data = HudLibrary.DrawArc(350, 350, radius, _angel, _angel + 25);
            pathL2.Data = HudLibrary.DrawArc(350, 350, radius + 20, _angel, _angel + 25);
            pathL3.Data = HudLibrary.DrawArc(350, 350, radius - 20, _angel, _angel + 25);

            

            RotateTransform rotateTransform = new RotateTransform();
            rotateTransform.Angle = angel * 30;
            text2.RenderTransform = rotateTransform;

            driverNameText.Text = driver.name;

            driverCountrol = new OWLOSDriverControl(driver);
            driverCountrol.parentControl.Visibility = Visibility.Hidden;
            driverCountrol.parentControl.Hide();


            double xr = 1000 * Math.Cos(Math.PI * (angel / 6.0) - Math.PI / 2) + parentOWLOSNodeControl.parentControl.transform.X;
            double yr = 1000 * Math.Sin(Math.PI * (angel / 6.0) - Math.PI / 2) + parentOWLOSNodeControl.parentControl.transform.Y;
            driverCountrol.parentControl.MoveTransform(xr, yr);


            (parentOWLOSNodeControl.parentControl.Parent as Grid).Children.Add(driverCountrol.parentControl);
            parentOWLOSNodeControl.parentControl.OnPositionChanged += ParentControl_OnPositionChanged;

            relationLine = new EcosystemRelationLine(driverCountrol, driverCountrol.parentControl, connector, driverCountrol, parentOWLOSNodeControl.parentControl.Parent as Grid);
            relationLine.DrawRelationLine(((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color.ToString(), ((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color.ToString());
            relationLine.Hide();


            

            //driver.NewProperty += Driver_NewProperty;

            //DoubleAnimation rotate2 = new DoubleAnimation(1300.0f, 0.0f, new Duration(TimeSpan.FromMilliseconds(50000)));

            //RotateTransform rotateTransform2 = new RotateTransform();
            //text2.RenderTransform = rotateTransform2;
            //rotateTransform2.BeginAnimation(RotateTransform.AngleProperty, rotate2);

        }

        private void ParentControl_OnPositionChanged(object sender, EventArgs e)
        {
            relationLine?.UpdatePositions();
        }

        private void text2_Initialized(object sender, EventArgs e)
        {

        }

        private void text2_Loaded(object sender, RoutedEventArgs e)
        {
            
        }

        private void pathL1_MouseEnter(object sender, MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation();
            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color;
            animation.Duration = new Duration(TimeSpan.FromSeconds(0.3));
            pathL1.Stroke = new SolidColorBrush(((SolidColorBrush)pathL1.Stroke).Color);
            pathL1.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);

            relationLine.curveLine.Stroke = new SolidColorBrush(((SolidColorBrush)relationLine.curveLine.Stroke).Color);
            relationLine.curveLine.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);

            driverCountrol.mainBorder.BorderBrush = new SolidColorBrush(((SolidColorBrush)driverCountrol.mainBorder.BorderBrush).Color);
            driverCountrol.mainBorder.BorderBrush.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void driverNameText_MouseEnter(object sender, MouseEventArgs e)
        {
            pathL1.Stroke = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
            relationLine.curveLine.Stroke = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
            driverCountrol.mainBorder.BorderBrush = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
        }


        private void pathL1_MouseLeave(object sender, MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation();
            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSInfo"]).Color;
            animation.Duration = new Duration(TimeSpan.FromSeconds(2));
            pathL1.Stroke = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
            pathL1.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);

            relationLine.curveLine.Stroke = new SolidColorBrush(((SolidColorBrush)relationLine.curveLine.Stroke).Color);
            relationLine.curveLine.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, animation);

            driverCountrol.mainBorder.BorderBrush = new SolidColorBrush(((SolidColorBrush)driverCountrol.mainBorder.BorderBrush).Color);
            driverCountrol.mainBorder.BorderBrush.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void pathL1_PreviewMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (!driverCountrol.parentControl.isVisible)
            {
                if (driverCountrol.parentControl.Visibility == Visibility.Hidden)
                {
                    driverCountrol.parentControl.Visibility = Visibility.Visible;
                }
                driverCountrol.parentControl.Show();
                relationLine.Show();
            }
            else
            {
                driverCountrol.parentControl.Hide();
                relationLine.Hide();
            }

        }

        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            PathTextControl pathText = new PathTextControl(350, 350, radius, 0, 25, driverNameText);
        }
    }
}
