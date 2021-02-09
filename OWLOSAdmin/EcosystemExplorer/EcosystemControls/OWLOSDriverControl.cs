using OWLOSAdmin.Ecosystem.OWLOS;
using System.Windows.Media;

namespace OWLOSAdmin.EcosystemExplorer.EcosystemControls
{
    public class OWLOSDriverControl : OWLOSPanelControl
    {
        private readonly OWLOSDriver driver;

        private int propertyCounter = 0;

        public OWLOSDriverControl(OWLOSDriver driver) : base()
        {

            this.driver = driver;

            panelName.Text = driver.name;

            if (driver != null)
            {
                driver.OnPropertyCreate += Driver_NewProperty;
            }
        }

        private void Driver_NewProperty(object sender, OWLOSPropertyWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {

                propertyCounter++;
                OWLOSDriverPropertyControl propertyControl = new OWLOSDriverPropertyControl(e.property);
                if ((propertyCounter & 1) > 0)
                {
                    propertyControl.Background = (SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha2"];
                }
                itemsHolder.Children.Add(propertyControl);
            });
        }

    }
}
