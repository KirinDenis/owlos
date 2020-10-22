using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemExplorer
{
    /// <summary>
    /// Interaction logic for LogControl.xaml
    /// </summary>
    public partial class LogControl : UserControl, IEcosystemChildControl
    {
        
        private OWLOSNodeWrapper nodeWrapper;

        public EcosystemControl parentControl { get; set; }

        public LogControl(OWLOSNodeWrapper nodeWrapper)
        {
            InitializeComponent();
            parentControl = new EcosystemControl(this);

            this.nodeWrapper = nodeWrapper;
            if (nodeWrapper != null)
            {
                nodeWrapper.node.OnNewDriver += Node_NewDriver;
            }
        }

        private void Node_NewDriver(object sender, OWLOSDriverWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                driversControl.Text = "";
                driversControl.Text = driversControl.Text + e.driver.name + "\n";
                //e.driver. += Driver_NewProperty;
            });
        }

        public void OnParentGetFocus()
        {
            mainBorder.BorderBrush = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
        }

        public void OnParentLostFocus()
        {
            mainBorder.BorderBrush = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha3"];
        }

        public void OnParentDrag()
        {
            //
        }

        public void OnParentDrop()
        {
            //
        }
    }
}
