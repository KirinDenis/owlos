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
using static OWLOSEcosystemService.DTO.Things.ThingAirQuality;

namespace OWLOSAirQuality
{
    /// <summary>
    /// Interaction logic for AirQualityMainWindow.xaml
    /// </summary>
    public partial class AirQualityMainWindow : Window
    {
        private OWLOSEcosystem ecosystem;
        private ConsoleControl logConsole;
        

        private ACValueControl DHT22TempValueControl = null;
        public AirQualityMainWindow()
        {
            InitializeComponent();

            Timer lifeCycleTimer = new Timer(1000)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();

            //controls

            logConsole = new ConsoleControl();
            ConsoleGrid.Children.Add(logConsole);


            /*
            for (int i = 0; i < 20; i++)
            {
                ValueControl v1 = new ValueControl();
                ValuesGrid.Children.Add(v1);
            }
            */


            //events     
            ecosystem = App.ecosystem;
            ecosystem.OnLog += Ecosystem_OnLog;
            ecosystem.OnACDataReady += Ecosystem_OnACDataReady;
        }

        private void Ecosystem_OnACDataReady(object sender, EventArgs e)
        {
            if (ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize-1].DHT22temp != null)
            {
                if (DHT22TempValueControl == null)
                {
                    for (int i = 0; i < 20; i++)
                    {
                        try
                        {
                            ThingAirQuality acData = ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1 - i * 10];
                            if (acData != null)
                            {
                                DHT22TempValueControl = new ACValueControl("Temperature", "Celsius", "DHT22 sensor");
                                acData.OnDHT22TempChanged += DHT22TempValueControl.OnValueChanged;
                                ValuesGrid.Children.Add(DHT22TempValueControl);
                            }

                            //DHT22TempValueControl = new ACValueControl();
                            //ValuesGrid.Children.Add(DHT22TempValueControl);
                            //ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1 - i * 10].OnDHT22TempChanged += AirQualityMainWindow_OnDHT22TempChanged;
                            //DHT22TempValueControl.ValueTextBlock.Text = ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1 - i * 1000].DHT22temp?.ToString();
                        }
                        catch { }
                    }
                }
            }
        }


        private void Ecosystem_OnLog(object sender, OWLOSLogEventArgs e)
        {
            logConsole.AddToconsole(e.Message, e.EventType);
        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            
            /*
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
            */
        }
    }
}
