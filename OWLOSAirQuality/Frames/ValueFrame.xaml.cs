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

namespace OWLOSAirQuality.Frames
{
    /// <summary>
    /// Interaction logic for ValueFrame.xaml
    /// </summary>
    public partial class ValueFrame : Window
    {
        private readonly OWLOSEcosystem ecosystem;

        private ACValueControl DHT22tempValueControl = null;

        private ACValueControl DHT22humValueControl = null;

        private ACValueControl DHT22heatValueControl = null;


        private ACValueControl BMP280pressureValueControl = null;

        private ACValueControl BMP280altitudeValueControl = null;

        private ACValueControl BMP280temperatureValueControl = null;


        private ACValueControl ADS1X15MQ135ValueControl = null;

        private ACValueControl ADS1X15MQ7ValueControl = null;

        private ACValueControl ADS1X15LightValueControl = null;


        private ACValueControl CCS811CO2ValueControl = null;

        private ACValueControl CCS811TVOCValueControl = null;

        private ACValueControl CCS811resistenceValueControl = null;

        private ACValueControl CCS811tempValueControl = null;

        public ValueFrame()
        {
            InitializeComponent();

            ecosystem = App.ecosystem;
            ecosystem.OnACDataReady += Ecosystem_OnACDataReady;

        }

        private void Ecosystem_OnACDataReady(object sender, EventArgs e)
        {
            //   if (ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1].DHT22temp != null)
            {
                if (DHT22tempValueControl == null)
                {


                    try
                    {
                        ThingAirQuality acData = ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1];
                        if (acData != null)
                        {
                            DHT22tempValueControl = new ACValueControl(acData.DHT22temp, "DHT22", "Celsius", "Temperature");
                            acData.OnDHT22tempChanged += DHT22tempValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(DHT22tempValueControl);

                            DHT22humValueControl = new ACValueControl(acData.DHT22hum, "DHT22", "%", "Humidity");
                            acData.OnDHT22humChanged += DHT22humValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(DHT22humValueControl);

                            DHT22heatValueControl = new ACValueControl(acData.DHT22heat, "DHT22", "", "Heat Index");
                            acData.OnDHT22heatChanged += DHT22heatValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(DHT22heatValueControl);


                            BMP280pressureValueControl = new ACValueControl(acData.BMP280pressure, "BMP280", "kPa", "Pressure");
                            acData.OnBMP280pressureChanged += BMP280pressureValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(BMP280pressureValueControl);


                            BMP280altitudeValueControl = new ACValueControl(acData.BMP280altitude, "BMP280", "Meters", "Altitude");
                            acData.OnBMP280altitudeChanged += BMP280altitudeValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(BMP280altitudeValueControl);


                            BMP280temperatureValueControl = new ACValueControl(acData.BMP280temperature, "BMP280", "Celsius", "Temperature");
                            acData.OnBMP280temperatureChanged += BMP280temperatureValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(BMP280temperatureValueControl);

                            ADS1X15MQ135ValueControl = new ACValueControl(acData.ADS1X15MQ135, "ADS1X15", "CO2|CO|Alcohol|Smoke|Dust", "MQ135");
                            acData.OnADS1X15MQ135Changed += ADS1X15MQ135ValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(ADS1X15MQ135ValueControl);

                            ADS1X15MQ7ValueControl = new ACValueControl(acData.ADS1X15MQ7, "ADS1X15", "CO", "MQ7");
                            acData.OnADS1X15MQ7Changed += ADS1X15MQ7ValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(ADS1X15MQ7ValueControl);

                            ADS1X15LightValueControl = new ACValueControl(acData.ADS1X15Light, "ADS1X15", "level", "Light");
                            acData.OnADS1X15LightChanged += ADS1X15LightValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(ADS1X15LightValueControl);

                            CCS811CO2ValueControl = new ACValueControl(acData.CCS811CO2, "CCS811", "PPM", "CO2");
                            acData.OnCCS811CO2Changed += CCS811CO2ValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(CCS811CO2ValueControl);

                            CCS811TVOCValueControl = new ACValueControl(acData.CCS811TVOC, "CCS811", "PPM", "TVOC");
                            acData.OnCCS811TVOCChanged += CCS811TVOCValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(CCS811TVOCValueControl);

                            CCS811resistenceValueControl = new ACValueControl(acData.CCS811resistence, "CCS811", "", "Resistance");
                            acData.OnCCS811resistenceChanged += CCS811resistenceValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(CCS811resistenceValueControl);

                            CCS811tempValueControl = new ACValueControl(acData.CCS811temp, "CCS811", "Fahrenheit ", "Temperature");
                            acData.OnCCS811tempChanged += CCS811tempValueControl.OnValueChanged;
                            ValuesGrid.Children.Add(CCS811tempValueControl);


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
}
