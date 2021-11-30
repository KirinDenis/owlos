﻿/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

using OWLOSAirQuality.Huds;
using OWLOSAirQuality.OWLOSEcosystemService;
using OWLOSEcosystemService.DTO.Things;
using System;
using System.Collections.Generic;
using System.Timers;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSAirQuality.Frames
{
    public class SearchIndex
    {
        public string Index = string.Empty;
        public UserControl RelatedValueControl;
    }
    /// <summary>
    /// Interaction logic for ValueFrame.xaml
    /// </summary>
    public partial class ValueFrame : Window
    {
        private readonly OWLOSEcosystemServiceClient EcosystemServiceClient;

        private bool SensorsJoined = false;

        private bool timerBusy = false;

        private object CurrentValueControl;

        private readonly int GraphRefreshInterval = 10000;

        private readonly List<SearchIndex> SearchIndices = new List<SearchIndex>();
        public ValueFrame(OWLOSEcosystemServiceClient EcosystemServiceClient)
        {
            InitializeComponent();
            
            this.EcosystemServiceClient = EcosystemServiceClient;
            EcosystemServiceClient.OnACDataReady += Ecosystem_OnACDataReady;

            Timer lifeCycleTimer = new Timer(GraphRefreshInterval)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();

            CurrentValueControl = DHT22tempValueControl;

            DHT22tempValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "DHT22 Temperature Celsius Fahrenheit",
                RelatedValueControl = DHT22tempValueControl
            });

            DHT22humValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "DHT22 humidity",
                RelatedValueControl = DHT22humValueControl
            });

            DHT22heatValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "DHT22 heat index",
                RelatedValueControl = DHT22heatValueControl
            });


            BMP280pressureValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "BMP280 pressure mmHg kPa Pa",
                RelatedValueControl = BMP280pressureValueControl
            });

            BMP280altitudeValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "BMP280 altitude meters",
                RelatedValueControl = BMP280altitudeValueControl
            });

            BMP280temperatureValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "BMP280 Temperature Celsius Fahrenheit",
                RelatedValueControl = BMP280temperatureValueControl
            });


            ADS1X15MQ135ValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "ADS1X15 MQ135 CO2 CO Alcohol Smoke Dust",
                RelatedValueControl = ADS1X15MQ135ValueControl
            });

            ADS1X15MQ7ValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "ADS1X15 MQ7 CO",
                RelatedValueControl = ADS1X15MQ7ValueControl
            });

            ADS1X15LightValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "ADS1X15 Light",
                RelatedValueControl = ADS1X15LightValueControl
            });


            CCS811CO2ValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "CCS811 CO2 eCO2 Parts Per Million PPM",
                RelatedValueControl = CCS811CO2ValueControl
            });

            CCS811TVOCValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "CCS811 TVOC Parts Per Billion PPB",
                RelatedValueControl = CCS811TVOCValueControl
            });

            CCS811resistenceValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "CCS811 resistance",
                RelatedValueControl = CCS811resistenceValueControl
            });

            CCS811tempValueControl.OnSelect += ValueControl_OnSelect;
            SearchIndices.Add(new SearchIndex()
            {
                Index = "CCS811 Temperature Celsius Fahrenheit",
                RelatedValueControl = CCS811tempValueControl
            });


            ShowHourMenu.OnSelect += ShowHourMenu_OnSelect;
            ShowDayMenu.OnSelect += ShowHourMenu_OnSelect;

            _BackgroundControl.QueryInterval = " x: " + EcosystemServiceClient.quaryInterval / 1000 + " sec / g: " + GraphRefreshInterval / 1000 + " sec ";
            _BackgroundControl.Status = "[not connected] " + DateTime.Now;
            _BackgroundControl.SearchTextBox.TextChanged += SearchTextBox_TextChanged;
            _BackgroundControl.SearchTextBox.GotFocus += SearchTextBox_GotFocus;
            _BackgroundControl.SearchTextBox.LostFocus += SearchTextBox_LostFocus;



            OnLifeCycleTimer(null, null);
        }

        private void SearchTextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(_BackgroundControl.SearchTextBox.Text))
            {
                _BackgroundControl.SearchTextBox.Text = "search";
            }
        }

        private void SearchTextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            _BackgroundControl.SearchTextBox.Text = string.Empty;
        }

        private void SearchTextBox_TextChanged(object sender, System.Windows.Controls.TextChangedEventArgs e)
        {
            string serchedText = (sender as TextBox).Text.ToLower();

            foreach(SearchIndex searchIndex in SearchIndices)
            {
                if (searchIndex.Index.ToLower().IndexOf(serchedText) != -1)
                {
                    if (searchIndex.RelatedValueControl.GetType() == typeof(ValueControl))
                    {
                        (searchIndex.RelatedValueControl as ValueControl).Focused = true;
                    }
                    else
                    if (searchIndex.RelatedValueControl.GetType() == typeof(PresureValueControl))
                    {
                        (searchIndex.RelatedValueControl as PresureValueControl).Focused = true;
                    }
                    else
                    if (searchIndex.RelatedValueControl.GetType() == typeof(TemperatureValueControl))
                    {
                        (searchIndex.RelatedValueControl as TemperatureValueControl).Focused = true;
                    }
                    break;
                }
            }
        }

        private void ShowHourMenu_OnSelect(object sender, EventArgs e)
        {
            OnLifeCycleTimer(null, null);
        }

        private void ValueControl_OnSelect(object sender, EventArgs e)
        {

            if (sender.GetType() == typeof(ValueControl))
            {
                ValueControl currentValueControl = (ValueControl)sender;

                ValueGraph.UnitOfMeasure.Text = "unit of measure: " + currentValueControl.UnitOfMeasure;
                ValueGraphCaption.Text = currentValueControl.Caption;
                ValueGraphDescription.Text = currentValueControl.Description;

                ValueGraph.HighDangerTrap = currentValueControl.HighDangerTrap;
                ValueGraph.HighWarningTrap = currentValueControl.HighWarningTrap;

                ValueGraph.LowDangerTrap = currentValueControl.LowDangerTrap;
                ValueGraph.LowWarningTrap = currentValueControl.LowWarningTrap;

                CurrentValueControl = currentValueControl;
            }
            else
            if (sender.GetType() == typeof(PresureValueControl))
            {
                PresureValueControl currentValueControl = (PresureValueControl)sender;

                ValueGraph.UnitOfMeasure.Text = "unit of measure: Pa";
                ValueGraphCaption.Text = currentValueControl.Caption;
                ValueGraphDescription.Text = currentValueControl.Description;

                ValueGraph.HighDangerTrap = currentValueControl.HighDangerTrap;
                ValueGraph.HighWarningTrap = currentValueControl.HighWarningTrap;

                ValueGraph.LowDangerTrap = currentValueControl.LowDangerTrap;
                ValueGraph.LowWarningTrap = currentValueControl.LowWarningTrap;

                CurrentValueControl = currentValueControl;
            }
            else
            if (sender.GetType() == typeof(TemperatureValueControl))
            {
                TemperatureValueControl currentValueControl = (TemperatureValueControl)sender;

                if (currentValueControl.DefaultCelsius)
                {
                    ValueGraph.UnitOfMeasure.Text = "unit of measure: Celsius";
                }
                else
                {
                    ValueGraph.UnitOfMeasure.Text = "unit of measure: Fahrenheit";
                }
                ValueGraphCaption.Text = currentValueControl.Caption;
                ValueGraphDescription.Text = currentValueControl.Description;

                ValueGraph.HighDangerTrap = currentValueControl.HighDangerTrap;
                ValueGraph.HighWarningTrap = currentValueControl.HighWarningTrap;

                ValueGraph.LowDangerTrap = currentValueControl.LowDangerTrap;
                ValueGraph.LowWarningTrap = currentValueControl.LowWarningTrap;

                CurrentValueControl = currentValueControl;
            }


            OnLifeCycleTimer(null, null);
        }

        private void Ecosystem_OnACDataReady(object sender, EventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {

                try
                {
                    _BackgroundControl.URL = EcosystemServiceClient.URL;
                    ThingAirQuality acData = EcosystemServiceClient.dailyAirQulity[OWLOSEcosystemServiceClient.dailyAirQulitySize - 1];
                    if (acData != null)
                    {
                        switch (acData.Status)
                        {
                            case ThingAirQualityStatus.Online:
                                _BackgroundControl.Status = "[online] " + DateTime.Now;
                                break;
                            case ThingAirQualityStatus.OnlineWithError:
                                _BackgroundControl.Status = "[online with error] " + DateTime.Now;
                                break;
                            case ThingAirQualityStatus.Offline:
                                _BackgroundControl.Status = "[offline] " + DateTime.Now;
                                break;
                            default:
                                _BackgroundControl.Status = "[error] " + DateTime.Now;
                                break;
                        }
                        if (!SensorsJoined)
                        {
                            acData.OnDHT22tempChanged += DHT22tempValueControl.OnValueChanged;                            
                            acData.OnDHT22humChanged += DHT22humValueControl.OnValueChanged;
                            acData.OnDHT22heatChanged += DHT22heatValueControl.OnValueChanged;

                            acData.OnBMP280pressureChanged += BMP280pressureValueControl.OnValueChanged;
                            acData.OnBMP280altitudeChanged += BMP280altitudeValueControl.OnValueChanged;
                            acData.OnBMP280temperatureChanged += BMP280temperatureValueControl.OnValueChanged;

                            acData.OnADS1X15MQ135Changed += ADS1X15MQ135ValueControl.OnValueChanged;
                            acData.OnADS1X15MQ7Changed += ADS1X15MQ7ValueControl.OnValueChanged;
                            acData.OnADS1X15LightChanged += ADS1X15LightValueControl.OnValueChanged;

                            acData.OnCCS811CO2Changed += CCS811CO2ValueControl.OnValueChanged;
                            acData.OnCCS811TVOCChanged += CCS811TVOCValueControl.OnValueChanged;
                            acData.OnCCS811resistenceChanged += CCS811resistenceValueControl.OnValueChanged;
                            acData.OnCCS811tempChanged += CCS811tempValueControl.OnValueChanged;

                            //Modes ---

                            acData.OnDHT22tempChanged += DHT22TempModeControl.OnValueChanged;
                            acData.OnDHT22humChanged += DHT22HumModeControl.OnValueChanged;
                            acData.OnDHT22heatChanged += DHT22HeatModeControl.OnValueChanged;

                            acData.OnBMP280pressureChanged += BMP280PressureModeControl.OnValueChanged;
                            acData.OnBMP280altitudeChanged += BMP280AltitudeModeControl.OnValueChanged;
                            acData.OnBMP280temperatureChanged += BMP280TempModeControl.OnValueChanged;

                            acData.OnADS1X15MQ135Changed += ADS1X15MQ135ModeControl.OnValueChanged;
                            acData.OnADS1X15MQ7Changed += ADS1X15MQ7ModeControl.OnValueChanged;
                            acData.OnADS1X15LightChanged += ADS1X15LightModeControl.OnValueChanged;

                            acData.OnCCS811CO2Changed += CCS811eCO2ModeControl.OnValueChanged;
                            acData.OnCCS811TVOCChanged += CCS811TVOCModeControl.OnValueChanged;
                            acData.OnCCS811resistenceChanged += CCS811ResistanceModeControl.OnValueChanged;
                            acData.OnCCS811tempChanged += CCS811TempModeControl.OnValueChanged;

                            SensorsJoined = true;
                        }
                    }
                    else
                    {
                        _BackgroundControl.Status = "[data is null] " + DateTime.Now;
                    }
                }
                catch
                {
                    _BackgroundControl.Status = "[error] " + DateTime.Now;
                }
            });
        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            if (timerBusy)
            {
                return;
            }
            timerBusy = true;

            if (EcosystemServiceClient == null)
            {
                timerBusy = false;
                return;
            }

            if (CurrentValueControl != null)
            {
                ThingAirQualityHistoryData thingAirQualities;
                if (ShowHourMenu.Selected)
                {
                    thingAirQualities = EcosystemServiceClient.GetOneHourData(0);
                }
                else
                {
                    thingAirQualities = EcosystemServiceClient.GetOneDayData(0);
                }

                base.Dispatcher.Invoke(() =>
                {
                    if (CurrentValueControl == DHT22humValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.DHT22hum, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == DHT22heatValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.DHT22heat, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == BMP280pressureValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.BMP280pressure, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == BMP280altitudeValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.BMP280altitude, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == BMP280temperatureValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.BMP280temperature, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == ADS1X15MQ135ValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.ADS1X15MQ135, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == ADS1X15MQ7ValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.ADS1X15MQ7, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == ADS1X15LightValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.ADS1X15Light, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == CCS811CO2ValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.CCS811CO2, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == CCS811TVOCValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.CCS811TVOC, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == CCS811resistenceValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.CCS811resistence, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    if (CurrentValueControl == CCS811tempValueControl)
                    {
                        ValueGraph.Update(thingAirQualities.CCS811temperature, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }
                    else
                    {
                        ValueGraph.Update(thingAirQualities.DHT22temp, thingAirQualities.QueryTime, thingAirQualities.Statuses);
                    }

                });
            }

            timerBusy = false;
        }
    }
}
