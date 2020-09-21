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

namespace OWLOSAdmin.EcosystemExplorer.EcosystemControls
{
    /// <summary>
    /// Interaction logic for OWLOSNodeDriverControl.xaml
    /// </summary>
    public partial class OWLOSNodeDriverControl : UserControl
    {
        private OWLOSDriverControl driverCountrol;
        private OWLOSNodeControl parentOWLOSNodeControl;
        public OWLOSNodeDriverControl(OWLOSNodeControl parentOWLOSNodeControl, OWLOSDriver driver, double radius, double angel)
        {
            InitializeComponent();


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
            (parentOWLOSNodeControl.parentControl.Parent as Grid).Children.Add(driverCountrol.parentControl);


            //driver.NewProperty += Driver_NewProperty;

            //DoubleAnimation rotate2 = new DoubleAnimation(1300.0f, 0.0f, new Duration(TimeSpan.FromMilliseconds(50000)));

            //RotateTransform rotateTransform2 = new RotateTransform();
            //text2.RenderTransform = rotateTransform2;
            //rotateTransform2.BeginAnimation(RotateTransform.AngleProperty, rotate2);

        }

        private void text2_Initialized(object sender, EventArgs e)
        {

        }

        private void text2_Loaded(object sender, RoutedEventArgs e)
        {
            Point[] offsetB = new Point[2];
            offsetB[0] = connector.TranslatePoint(new Point(0, 0), parentOWLOSNodeControl);            
            offsetB[1] = new Point(0, 0);


            var relationLine = new EcosystemRelationLine(driverCountrol, driverCountrol.parentControl, parentOWLOSNodeControl.parentControl, driverCountrol, parentOWLOSNodeControl.parentControl.Parent as Grid, null, offsetB);
            relationLine.DrawRelationLine();

        }
    }
}
