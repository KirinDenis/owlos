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
    public partial class OWLOSDriverPropControl : UserControl, IEcosystemChildControl
    {

        private OWLOSDriver driver;

        public EcosystemControl parentControl { get; set; }

        public OWLOSDriverPropControl(OWLOSDriver driver)
        {
            InitializeComponent();

            parentControl = new EcosystemControl(this);

            this.driver = driver;
            if (driver != null)
            {
                driver.NewProperty += Driver_NewProperty;
                driver.ChangeProperty += Driver_ChangeProperty;
            }

        }

        private void Driver_ChangeProperty(object sender, OWLOSPropertyWrapperEventArgs e)
        {
            //base.Dispatcher.Invoke(() =>
            //{
              //  driversControl.Text = driversControl.Text + e.property.name + " " + e.property.value + "\n";
            //});

        }

        private void Driver_NewProperty(object sender, OWLOSPropertyWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                driversControl.Text = driversControl.Text + e.property.name + " " + e.property.value + "\n";
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
