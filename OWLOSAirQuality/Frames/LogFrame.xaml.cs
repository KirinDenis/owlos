using OWLOSAirQuality.Huds;
using OWLOSAirQuality.OWLOSEcosystemService;
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
using System.Windows.Shapes;

namespace OWLOSAirQuality.Frames
{
    /// <summary>
    /// Interaction logic for LogFrame.xaml
    /// </summary>
    public partial class LogFrame : Window
    {
        private readonly OWLOSEcosystemServiceClient EcosystemServiceClient;
        private readonly ConsoleControl logConsole;
        public LogFrame(OWLOSEcosystemServiceClient EcosystemServiceClient)
        {
            InitializeComponent();
            this.EcosystemServiceClient = EcosystemServiceClient;
            logConsole = new ConsoleControl();
            LogGrid.Children.Add(logConsole);
            EcosystemServiceClient.OnLog += Ecosystem_OnLog;
        }

        private void Ecosystem_OnLog(object sender, OWLOSLogEventArgs e)
        {
            logConsole.AddToconsole(e.Message, e.EventType);
        }

    }
}
