using OWLOSAirQuality.Huds;
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
        private ConsoleControl logConsole;
        private ConsoleControl logConsole2;
        public AirQualityMainWindow()
        {
            InitializeComponent();

            Timer lifeCycleTimer = new Timer(1000)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();

            logConsole = new ConsoleControl();
            ConsoleGrid.Children.Add(logConsole);

            logConsole2 = new ConsoleControl();
            ConsoleGrid2.Children.Add(logConsole2);



            OWLOSEcosystem ecosystem = App.ecosystem;

            ecosystem.OnLog += Ecosystem_OnLog;
        }

        private void Ecosystem_OnLog(object sender, OWLOSLogEventArgs e)
        {
            logConsole.AddToconsole(e.Message, e.EventType);
        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            
            string report = string.Empty;
            OWLOSEcosystem ecosystem = App.ecosystem;
            foreach(ThingAirQualityDTO ac in ecosystem.dailyAirQulity)
            {
                if (ac != null)
                {
                    report += ac.QueryTime.ToString() + " " + ac.DHT22temp + " \n ";                    
                }
            }
            base.Dispatcher.Invoke(() =>
            {
                logConsole2.AddToconsole(report, ConsoleMessageCode.Info);
                //text.Text = report;
            });
            
        }
    }
}
