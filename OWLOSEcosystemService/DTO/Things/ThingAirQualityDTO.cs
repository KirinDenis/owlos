using System;
using System.ComponentModel.DataAnnotations;

namespace OWLOSEcosystemService.DTO.Things
{
    public enum ThingAirQualityStatus { Online, Offline, OnlineWithError, Error }


    public class ThingAirQualityDTO
    {
        [Key]
        public Guid userId { get; set; }
        public int thingId { get; set; }
        public ThingAirQualityStatus Status { get; set; } = ThingAirQualityStatus.Error;
        public DateTime QueryTime { get; set; }
        public long TickCount { get; set; }

        public bool hasHistory = false;
        public bool DHT22 { get; set; }
        public float DHT22temp { get; set; }
        public string DHT22tempHD { get; set; } = string.Empty;
        public float DHT22hum { get; set; }
        public string DHT22humHD { get; set; }
        public float DHT22heat { get; set; }
        public string DHT22heatHD { get; set; }
        public bool DHT22c { get; set; }

        public bool BMP280 { get; set; }
        public float BMP280pressure { get; set; }
        public string BMP280pressureHD { get; set; }
        public float BMP280altitude { get; set; }
        public string BMP280altitudeHD { get; set; }
        public float BMP280temperature { get; set; }
        public string BMP280temperatureHD { get; set; }

        public bool ADS1X15 { get; set; }
        public float ADS1X15MQ135 { get; set; }
        public string ADS1X15MQ135HD { get; set; }
        public float ADS1X15MQ7 { get; set; }
        public string ADS1X15MQ7HD { get; set; }
        public float ADS1X15Light { get; set; }
        public string ADS1X15LightHD { get; set; }

        public bool CCS811 { get; set; }
        public float CCS811CO2 { get; set; }
        public string CCS811CO2HD { get; set; }
        public float CCS811TVOC { get; set; }
        public string CCS811TVOCHD { get; set; }
        public float CCS811resistence { get; set; }
        public string CCS811resistenceHD { get; set; }
        public float CCS811temp { get; set; }
        public string CCS811tempHD { get; set; }

    }
}
