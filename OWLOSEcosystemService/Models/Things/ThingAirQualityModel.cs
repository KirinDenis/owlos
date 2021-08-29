using System;
using System.ComponentModel.DataAnnotations;

namespace OWLOSEcosystemService.Models.Things
{
    public enum ThingAirQualityStatus { Online, Offline, OnlineWithError, Error }


    public class ThingAirQualityModel
    {
        [Key]
        public int id { get; set; }
        public ThingAirQualityStatus Status { get; set; } = ThingAirQualityStatus.Error;
        public DateTime QueryTime { get; set; }

        public bool DHT22 { get; set; }

        private float _DHT22temp = float.NaN;
        public float DHT22temp 
        { 
            get { return _DHT22temp;  }
            set { _DHT22temp = value; } 
        }
        public string DHT22temph { get; set; } = string.Empty;
        public float DHT22hum { get; set; }
        public string DHT22humh { get; set; }
        public float DHT22heat { get; set; }
        public string DHT22heath { get; set; }
        public bool DHT22c { get; set; }

        public bool BMP280 { get; set; }
        public float BMP280pressure { get; set; }
        public string BMP280pressureh { get; set; }
        public float BMP280altitude { get; set; }
        public string BMP280altitudeh { get; set; }
        public float BMP280temperature { get; set; }
        public string BMP280temperatureh { get; set; }

        public bool ADS1X15 { get; set; }
        public float ADS1X15MQ135 { get; set; }
        public string ADS1X15MQ135h { get; set; }
        public float ADS1X15MQ7 { get; set; }
        public string ADS1X15MQ7h { get; set; }
        public float ADS1X15Light { get; set; }
        public string ADS1X15Lighth { get; set; }

        public bool CCS811 { get; set; }
        public float CCS811CO2 { get; set; }
        public string CCS811CO2h { get; set; }
        public float CCS811TVOC { get; set; }
        public string CCS811TVOCh { get; set; }
        public float CCS811resistence { get; set; }
        public string CCS811resistenceh { get; set; }
        public float CCS811temp { get; set; }
        public string CCS811temph { get; set; }

    }
}
