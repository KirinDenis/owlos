using OWLOSAirQuality.Huds;
using OWLOSAirQuality.OWLOSEcosystemService;
using OWLOSEcosystemService.DTO.Things;
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
using System.Timers;

namespace OWLOSAirQuality.Frames
{
    /// <summary>
    /// Interaction logic for GraphFrame.xaml
    /// </summary>
    public partial class GraphFrame : Window
    {
        private readonly OWLOSEcosystem ecosystem;
        private readonly ConsoleControl logConsole;
        private bool timerBusy = false;

        private GraphControl DHT22tempGraphControl = null;

        private GraphControl DHT22humGraphControl = null;

        private GraphControl DHT22heatGraphControl = null;

        private GraphControl BMP280pressureGraphControl = null;

        private GraphControl BMP280altitudeGraphControl = null;

        private GraphControl ADS1X15MQ135GraphControl = null;

        private GraphControl ADS1X15MQ7GraphControl = null;

        private GraphControl ADS1X15LightGraphControl = null;

        private GraphControl CCS811CO2GraphControl = null;

        private GraphControl CCS811TVOCGraphControl = null;

        private GraphControl CCS811resistenceGraphControl = null;

        public GraphFrame()
        {
            InitializeComponent();

            ecosystem = App.ecosystem;

            Timer lifeCycleTimer = new Timer(10000)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();


            //Graph controls 
            /*
            DHT22tempGraphControl = new GraphControl();
            DHT22tempGraphControl.NameTextBlock.Text = "DHT22 Temperature";
            GraphGrid.Children.Add(DHT22tempGraphControl);


            DHT22humGraphControl = new GraphControl();
            DHT22humGraphControl.NameTextBlock.Text = "DHT22 Humidity";
            GraphGrid.Children.Add(DHT22humGraphControl);

            DHT22heatGraphControl = new GraphControl();
            DHT22heatGraphControl.NameTextBlock.Text = "DHT22 Heat Index";
            GraphGrid.Children.Add(DHT22heatGraphControl);

            BMP280pressureGraphControl = new GraphControl();
            BMP280pressureGraphControl.NameTextBlock.Text = "BMP280 Pressure";
            GraphGrid.Children.Add(BMP280pressureGraphControl);

            BMP280altitudeGraphControl = new GraphControl();
            BMP280altitudeGraphControl.NameTextBlock.Text = "BMP280 Altitude";
            GraphGrid.Children.Add(BMP280altitudeGraphControl);

            CCS811CO2GraphControl = new GraphControl();
            CCS811CO2GraphControl.NameTextBlock.Text = "CO2";
            GraphGrid.Children.Add(CCS811CO2GraphControl);

            //DOUBLE 
            DHT22tempGraphControl = new GraphControl();
            DHT22tempGraphControl.NameTextBlock.Text = "DHT22 Temperature";
            GraphGrid.Children.Add(DHT22tempGraphControl);


            DHT22humGraphControl = new GraphControl();
            DHT22humGraphControl.NameTextBlock.Text = "DHT22 Humidity";
            GraphGrid.Children.Add(DHT22humGraphControl);

            DHT22heatGraphControl = new GraphControl();
            DHT22heatGraphControl.NameTextBlock.Text = "DHT22 Heat Index";
            GraphGrid.Children.Add(DHT22heatGraphControl);

            BMP280pressureGraphControl = new GraphControl();
            BMP280pressureGraphControl.NameTextBlock.Text = "BMP280 Pressure";
            GraphGrid.Children.Add(BMP280pressureGraphControl);

            BMP280altitudeGraphControl = new GraphControl();
            BMP280altitudeGraphControl.NameTextBlock.Text = "BMP280 Altitude";
            GraphGrid.Children.Add(BMP280altitudeGraphControl);

            CCS811CO2GraphControl = new GraphControl();
            CCS811CO2GraphControl.NameTextBlock.Text = "CO2";
            GraphGrid.Children.Add(CCS811CO2GraphControl);

            DHT22tempGraphControl = new GraphControl();
            DHT22tempGraphControl.NameTextBlock.Text = "DHT22 Temperature";
            GraphGrid.Children.Add(DHT22tempGraphControl);


            DHT22humGraphControl = new GraphControl();
            DHT22humGraphControl.NameTextBlock.Text = "DHT22 Humidity";
            GraphGrid.Children.Add(DHT22humGraphControl);

            DHT22heatGraphControl = new GraphControl();
            DHT22heatGraphControl.NameTextBlock.Text = "DHT22 Heat Index";
            GraphGrid.Children.Add(DHT22heatGraphControl);

            BMP280pressureGraphControl = new GraphControl();
            BMP280pressureGraphControl.NameTextBlock.Text = "BMP280 Pressure";
            GraphGrid.Children.Add(BMP280pressureGraphControl);

            BMP280altitudeGraphControl = new GraphControl();
            BMP280altitudeGraphControl.NameTextBlock.Text = "BMP280 Altitude";
            GraphGrid.Children.Add(BMP280altitudeGraphControl);

            CCS811CO2GraphControl = new GraphControl();
            CCS811CO2GraphControl.NameTextBlock.Text = "CO2";
            GraphGrid.Children.Add(CCS811CO2GraphControl);
            */


            //  CCS811TVOCGraphControl = new GraphControl();
            //   CCS811TVOCGraphControl.NameTextBlock.Text = "TVOC";
            //  GraphGrid.Children.Add(CCS811TVOCGraphControl);



            /*

            ADS1X15MQ135GraphControl = new GraphControl();
            ADS1X15MQ135GraphControl.NameTextBlock.Text = "MQ135";
            GraphGrid.Children.Add(ADS1X15MQ135GraphControl);

            ADS1X15MQ7GraphControl = new GraphControl();
            ADS1X15MQ7GraphControl.NameTextBlock.Text = "MQ7";
            GraphGrid.Children.Add(ADS1X15MQ7GraphControl);

            ADS1X15LightGraphControl = new GraphControl();
            ADS1X15LightGraphControl.NameTextBlock.Text = "Light";
            GraphGrid.Children.Add(ADS1X15LightGraphControl);


            CCS811resistenceGraphControl = new GraphControl();
            CCS811resistenceGraphControl.NameTextBlock.Text = "Resistance";
            GraphGrid.Children.Add(CCS811resistenceGraphControl);
            */
        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            if (timerBusy)
            {
                return;
            }
            timerBusy = true;

            if (ecosystem == null)
            {
                timerBusy = false;
                return;
            }

            ThingAirQualityHistoryData thingAirQualities = ecosystem.GetOneHourData(0);

            

            base.Dispatcher.Invoke(() =>
            {

                /*
                DHT22tempGraphControl.Update(thingAirQualities.DHT22temp, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                DHT22humGraphControl.Update(thingAirQualities.DHT22hum, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                DHT22heatGraphControl.Update(thingAirQualities.DHT22heat, thingAirQualities.QueryTime, thingAirQualities.Statuses);

                BMP280pressureGraphControl.Update(thingAirQualities.BMP280pressure, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                BMP280altitudeGraphControl.Update(thingAirQualities.BMP280altitude, thingAirQualities.QueryTime, thingAirQualities.Statuses);

                CCS811CO2GraphControl.Update(thingAirQualities.CCS811CO2, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                */
                // CCS811TVOCGraphControl.Update(thingAirQualities.CCS811TVOC, thingAirQualities.QueryTime, thingAirQualities.Statuses);

                /*
                DHT22humGraphControl.data = thingAirQualities.DHT22hum;
                DHT22humGraphControl.Draw();

                DHT22heatGraphControl.data = thingAirQualities.DHT22heat;
                DHT22heatGraphControl.Draw();

                BMP280pressureGraphControl.data = thingAirQualities.BMP280pressure;
                BMP280pressureGraphControl.Draw();

                BMP280altitudeGraphControl.data = thingAirQualities.BMP280altitude;
                BMP280altitudeGraphControl.Draw();

                ADS1X15MQ135GraphControl.data = thingAirQualities.ADS1X15MQ135;
                ADS1X15MQ135GraphControl.Draw();

                ADS1X15MQ7GraphControl.data = thingAirQualities.ADS1X15MQ7;
                ADS1X15MQ7GraphControl.Draw();

                ADS1X15LightGraphControl.data = thingAirQualities.ADS1X15Light;
                ADS1X15LightGraphControl.Draw();

                CCS811CO2GraphControl.data = thingAirQualities.CCS811CO2;
                CCS811CO2GraphControl.Draw();

                CCS811TVOCGraphControl.data = thingAirQualities.CCS811TVOC;
                CCS811TVOCGraphControl.Draw();

                CCS811resistenceGraphControl.data = thingAirQualities.CCS811resistence;
                CCS811resistenceGraphControl.Draw();
                */
            });

            /*
            string report = string.Empty;
            //OWLOSEcosystem ecosystem = App.ecosystem;
            foreach(ThingAirQuality ac in ecosystem.dailyAirQulity)
            {
                if (ac != null)
                {
                    report += ac.QueryTime.ToString() + " " + ac.DHT22temp + "|";                    
                }
            }
            base.Dispatcher.Invoke(() =>
            {
            
                text.Text = report;
            });
            */

            timerBusy = false;
        }

    }
    }
