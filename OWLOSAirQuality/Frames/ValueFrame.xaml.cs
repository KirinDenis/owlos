/* ----------------------------------------------------------------------------
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

using OWLOSAirQuality.OWLOSEcosystemService;
using OWLOSEcosystemService.DTO.Things;
using System;
using System.Windows;

namespace OWLOSAirQuality.Frames
{
    /// <summary>
    /// Interaction logic for ValueFrame.xaml
    /// </summary>
    public partial class ValueFrame : Window
    {
        private readonly OWLOSEcosystem ecosystem;

        private bool SensorsJoined = false;
        public ValueFrame()
        {
            InitializeComponent();
            ecosystem = App.ecosystem;
            ecosystem.OnACDataReady += Ecosystem_OnACDataReady;
        }

        private void Ecosystem_OnACDataReady(object sender, EventArgs e)
        {                       
                if (!SensorsJoined)
                {
                    try
                    {
                        ThingAirQuality acData = ecosystem.dailyAirQulity[OWLOSEcosystem.dailyAirQulitySize - 1];
                        if (acData != null)
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
                        SensorsJoined = true;
                        }
                    }
                    catch { }
                }            
        }
    }
}
