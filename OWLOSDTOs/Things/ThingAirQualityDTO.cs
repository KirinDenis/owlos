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

using System;

namespace OWLOSEcosystemService.DTO.Things
{
    public enum ThingAirQualityStatus { Online, Offline, OnlineWithError, Error, ServerNotConnected, ServerError }
    public class ACValueEventArgs : EventArgs
    {
        public float? value;

        public ACValueEventArgs(float? value)
        {
            this.value = value;
        }
    }

    public class ThingAirQualityHistoryData
    {
        public Guid UserId { get; set; }
        public int ThingId { get; set; }
        public ThingAirQualityStatus[] Statuses { get; set; } = null;
        public DateTime?[] QueryTime { get; set; }
        public DateTime?[] ClientTime { get; set; }
        public long?[] TickCount { get; set; }
        public bool[] DHT22 { get; set; }
        
        public float?[] DHT22temp { get; set; } = null;

        public float?[] DHT22hum { get; set; } = null;

        public float?[] DHT22heat { get; set; } = null;

        public float?[] BMP280pressure { get; set; } = null;

        public float?[] BMP280altitude { get; set; } = null;

        public float?[] ADS1X15MQ135 { get; set; } = null;

        public float?[] ADS1X15MQ7 { get; set; } = null;

        public float?[] ADS1X15Light { get; set; } = null;

        public float?[] CCS811CO2 { get; set; } = null;

        public float?[] CCS811TVOC { get; set; } = null;

        public float?[] CCS811resistence { get; set; } = null;
    }

    public class ThingAirQuality
    {
        public Guid UserId { get; set; }
        public int ThingId { get; set; }
        public ThingAirQualityStatus Status { get; set; } = ThingAirQualityStatus.Error;
        public DateTime? QueryTime { get; set; } = null;
        public DateTime? ClientTime { get; set; } = null;
        public long? TickCount { get; set; } = null;

        public bool hasHistory = false;
        public bool DHT22 { get; set; } = false;

        //DHT22 Temperature ---
        private float? _DHT22temp { get; set; } = null;
        public float? DHT22temp
        {
            get => _DHT22temp;
            set
            {
                if (_DHT22temp != value)
                {
                    OnDHT22tempChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _DHT22temp = value;
            }
        }

        public delegate void OnDHT22tempValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnDHT22tempValueChangeEventHandler OnDHT22tempChanged;
        //--- ENDOF DHT22 Temperature

        public float[] DHT22tempHD { get; set; } = null;

        //DHT22 Humidity ---
        private float? _DHT22hum { get; set; } = null;
        public float? DHT22hum
        {
            get => _DHT22hum;
            set
            {
                if (_DHT22hum != value)
                {
                    OnDHT22humChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _DHT22hum = value;
            }
        }

        public delegate void OnDHT22humValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnDHT22humValueChangeEventHandler OnDHT22humChanged;
        //--- ENDOF DHT22 Humidity

        public string? DHT22humHD { get; set; }

        //DHT22 Heat Index ---
        private float? _DHT22heat { get; set; } = null;
        public float? DHT22heat
        {
            get => _DHT22heat;
            set
            {
                if (_DHT22heat != value)
                {
                    OnDHT22heatChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _DHT22heat = value;
            }
        }

        public delegate void OnDHT22heatValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnDHT22heatValueChangeEventHandler OnDHT22heatChanged;
        //--- ENDOF DHT22 Heat Index

        public string? DHT22heatHD { get; set; }
        public bool? DHT22c { get; set; } = null;

        public bool BMP280 { get; set; } = false;

        //BMP280 pressure ---
        private float? _BMP280pressure { get; set; } = null;
        public float? BMP280pressure
        {
            get => _BMP280pressure;
            set
            {
                if (_BMP280pressure != value)
                {
                    OnBMP280pressureChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _BMP280pressure = value;
            }
        }

        public delegate void OnBMP280pressureValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnBMP280pressureValueChangeEventHandler OnBMP280pressureChanged;
        //--- ENDOF BMP280 pressure

        public string? BMP280pressureHD { get; set; }

        //BMP280 altitude ---
        private float? _BMP280altitude { get; set; } = null;
        public float? BMP280altitude
        {
            get => _BMP280altitude;
            set
            {
                if (_BMP280altitude != value)
                {
                    OnBMP280altitudeChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _BMP280altitude = value;
            }
        }

        public delegate void OnBMP280altitudeValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnBMP280altitudeValueChangeEventHandler OnBMP280altitudeChanged;
        //--- ENDOF BMP280 altitude

        public string? BMP280altitudeHD { get; set; }

        //BMP280 temperature ---
        private float? _BMP280temperature { get; set; } = null;
        public float? BMP280temperature
        {
            get => _BMP280temperature;
            set
            {
                if (_BMP280temperature != value)
                {
                    OnBMP280temperatureChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _BMP280temperature = value;
            }
        }

        public delegate void OnBMP280temperatureValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnBMP280temperatureValueChangeEventHandler OnBMP280temperatureChanged;
        //--- ENDOF BMP280 temperature

        public string? BMP280temperatureHD { get; set; }

        public bool ADS1X15 { get; set; } = false;

        //ADS1X15 MQ135 (A2) ---
        private float? _ADS1X15MQ135 { get; set; } = null;
        public float? ADS1X15MQ135
        {
            get => _ADS1X15MQ135;
            set
            {
                if (_ADS1X15MQ135 != value)
                {
                    OnADS1X15MQ135Changed?.Invoke(this, new ACValueEventArgs(value));
                }
                _ADS1X15MQ135 = value;
            }
        }

        public delegate void OnADS1X15MQ135ValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnADS1X15MQ135ValueChangeEventHandler OnADS1X15MQ135Changed;
        //--- ENDOF ADS1X15 MQ135 (A2)

        public string? ADS1X15MQ135HD { get; set; }

        //ADS1X15 MQ7 (A1) ---
        private float? _ADS1X15MQ7 { get; set; } = null;
        public float? ADS1X15MQ7
        {
            get => _ADS1X15MQ7;
            set
            {
                if (_ADS1X15MQ7 != value)
                {
                    OnADS1X15MQ7Changed?.Invoke(this, new ACValueEventArgs(value));
                }
                _ADS1X15MQ7 = value;
            }
        }

        public delegate void OnADS1X15MQ7ValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnADS1X15MQ7ValueChangeEventHandler OnADS1X15MQ7Changed;
        //--- ENDOF ADS1X15 MQ7 (A1)

        public string? ADS1X15MQ7HD { get; set; }

        //ADS1X15 Light (A0) ---
        private float? _ADS1X15Light { get; set; } = null;
        public float? ADS1X15Light
        {
            get => _ADS1X15Light;
            set
            {
                if (_ADS1X15Light != value)
                {
                    OnADS1X15LightChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _ADS1X15Light = value;
            }
        }

        public delegate void OnADS1X15LightValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnADS1X15LightValueChangeEventHandler OnADS1X15LightChanged;
        //--- ENDOF ADS1X15 Light (A0)

        public string? ADS1X15LightHD { get; set; }

        public bool CCS811 { get; set; } = false;

        //CCS811 CO2 ---
        private float? _CCS811CO2 { get; set; } = null;
        public float? CCS811CO2
        {
            get => _CCS811CO2;
            set
            {
                if (_CCS811CO2 != value)
                {
                    OnCCS811CO2Changed?.Invoke(this, new ACValueEventArgs(value));
                }
                _CCS811CO2 = value;
            }
        }

        public delegate void OnCCS811CO2ValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnCCS811CO2ValueChangeEventHandler OnCCS811CO2Changed;
        //--- ENDOF CCS811 CO2

        public string? CCS811CO2HD { get; set; }

        //CCS811 TVOC (Volatile Organic Compounds) ---
        private float? _CCS811TVOC { get; set; } = null;
        public float? CCS811TVOC
        {
            get => _CCS811TVOC;
            set
            {
                if (_CCS811TVOC != value)
                {
                    OnCCS811TVOCChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _CCS811TVOC = value;
            }
        }

        public delegate void OnCCS811TVOCValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnCCS811TVOCValueChangeEventHandler OnCCS811TVOCChanged;
        //--- ENDOF CCS811 TVOC (Volatile Organic Compounds)

        public string? CCS811TVOCHD { get; set; }

        //CCS811 Resistance (Volatile Organic Compounds) ---
        private float? _CCS811resistence { get; set; } = null;
        public float? CCS811resistence
        {
            get => _CCS811resistence;
            set
            {
                if (_CCS811resistence != value)
                {
                    OnCCS811resistenceChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _CCS811resistence = value;
            }
        }

        public delegate void OnCCS811resistenceValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnCCS811resistenceValueChangeEventHandler OnCCS811resistenceChanged;
        //--- ENDOF CCS811 TVOC (Volatile Organic Compounds)

        public string? CCS811resistenceHD { get; set; }

        //CCS811 Temperature ---
        private float? _CCS811temp { get; set; } = null;
        public float? CCS811temp
        {
            get => _CCS811temp;
            set
            {
                if (_CCS811temp != value)
                {
                    OnCCS811tempChanged?.Invoke(this, new ACValueEventArgs(value));
                }
                _CCS811temp = value;
            }
        }

        public delegate void OnCCS811tempValueChangeEventHandler(object? sender, ACValueEventArgs e);
        public event OnCCS811tempValueChangeEventHandler OnCCS811tempChanged;
        //--- ENDOF CCS811 Temperature

        public string? CCS811tempHD { get; set; }
    }


    public class ThingAirQualityDTO
    {
        public Guid UserId { get; set; }
        public int ThingId { get; set; }
        public ThingAirQualityStatus Status { get; set; } = ThingAirQualityStatus.Error;
        public DateTime? QueryTime { get; set; } = null;
        public DateTime? ClientTime { get; set; } = null;
        public long? TickCount { get; set; } = null;

        public bool hasHistory = false;
        public bool DHT22 { get; set; } = false;
        public float? DHT22temp { get; set; } = null;
        public string? DHT22tempHD { get; set; } = string.Empty;
        public float? DHT22hum { get; set; } = null;
        public string? DHT22humHD { get; set; }
        public float? DHT22heat { get; set; } = null;
        public string? DHT22heatHD { get; set; }
        public bool? DHT22c { get; set; } = null;

        public bool BMP280 { get; set; } = false;
        public float? BMP280pressure { get; set; } = null;
        public string? BMP280pressureHD { get; set; }
        public float? BMP280altitude { get; set; } = null;
        public string? BMP280altitudeHD { get; set; }
        public float? BMP280temperature { get; set; } = null;
        public string? BMP280temperatureHD { get; set; }

        public bool ADS1X15 { get; set; } = false;
        public float? ADS1X15MQ135 { get; set; } = null;
        public string? ADS1X15MQ135HD { get; set; }
        public float? ADS1X15MQ7 { get; set; } = null;
        public string? ADS1X15MQ7HD { get; set; }
        public float? ADS1X15Light { get; set; } = null;
        public string? ADS1X15LightHD { get; set; }

        public bool CCS811 { get; set; } = false;
        public float? CCS811CO2 { get; set; } = null;
        public string? CCS811CO2HD { get; set; }
        public float? CCS811TVOC { get; set; } = null;
        public string? CCS811TVOCHD { get; set; }
        public float? CCS811resistence { get; set; } = null;
        public string? CCS811resistenceHD { get; set; }
        public float? CCS811temp { get; set; } = null;
        public string? CCS811tempHD { get; set; }

    }
}
