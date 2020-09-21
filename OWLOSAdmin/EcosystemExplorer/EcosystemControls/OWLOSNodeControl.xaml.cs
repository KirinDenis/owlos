using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.EcosystemExplorer.EcosystemControls;
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

        private double radius = 300;
        private double angel1 = 0;

        private OWLOSNodeWrapper nodeWrapper;

        public int driversCount = 0;

        public OWLOSNodeControl(OWLOSNodeWrapper nodeWrapper)
        {

            this.nodeWrapper = nodeWrapper;
            if (nodeWrapper != null)
            {
                nodeWrapper.node.OnNewDriver += Node_OnNewDriver;
            }

            InitializeComponent();

            parentControl = new EcosystemControl(this);

            nodeShadowPath.Data = 
            nodePath.Data = HudLibrary.DrawArc(350, 350, radius, 0, 359);

            

        }

        private void Node_OnNewDriver(object sender, Ecosystem.OWLOS.OWLOSDriverWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {

                OWLOSNodeDriverControl _OWLOSNodeDriverControl = new OWLOSNodeDriverControl(this, e.driver, radius + 25, driversCount);
                driversCount++;
                nodeGrid.Children.Add(_OWLOSNodeDriverControl);
                /*
                 OWLOSDriverControl driverCountrol = new OWLOSDriverControl(e.driver);
                 (this.parentControl.Parent as Grid).Children.Add(driverCountrol.parentControl);



                var relationLine = new EcosystemRelationLine(driverCountrol, driverCountrol.parentControl, this.parentControl, driverCountrol, this.parentControl.Parent as Grid);
                relationLine.DrawRelationLine();
                */

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
        }



        /*
        private void path5_MouseEnter(object sender, MouseEventArgs e)
        {

        }
        */

        private void path5_MouseLeave(object sender, MouseEventArgs e)
        {

        }

    }
}
