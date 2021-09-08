using OWLOSAirQuality.OWLOSEcosystemService;
using OWLOSEcosystemService.DTO.Things;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace OWLOSAirQuality
{
    /// <summary>
    /// Interaction logic for AirQualityMainWindow.xaml
    /// </summary>
    public partial class AirQualityMainWindow : Window
    {
        public AirQualityMainWindow()
        {
            InitializeComponent();

            Timer lifeCycleTimer = new Timer(1000)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();           
        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            string report = string.Empty;
            OWLOSEcosystem ecosystem = App.ecosystem;
            foreach(ThingAirQualityDTO ac in ecosystem.dailyAirQulity)
            {
                if (ac != null)
                {
                    report += ac.ClientTime.ToString() + " " + ac.DHT22temp + " | ";                    
                }
            }
            base.Dispatcher.Invoke(() =>
            {

                text.Text = report;
            });
        }
    }
}
