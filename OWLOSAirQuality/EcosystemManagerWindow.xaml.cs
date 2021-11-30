using OWLOSAirQuality.OWLOSEcosystemService;
using System.Windows;

namespace OWLOSAirQuality
{
    public partial class EcosystemManagerWindow : Window
    {
        protected OWLOSEcosystemManager EcosystemManager;
        public EcosystemManagerWindow()
        {
            InitializeComponent();
            this.EcosystemManager = App.EcosystemManager;
        }

        private void button1_Click(object sender, RoutedEventArgs e)
        {
            new SingleAirQualityMainWindow(EcosystemManager.OWLOSEcosystemServiceClients[0]).Show();
        }

        private void button2_Click(object sender, RoutedEventArgs e)
        {
            new SingleAirQualityMainWindow(EcosystemManager.OWLOSEcosystemServiceClients[1]).Show();
        }
    }
}
