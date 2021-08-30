using OWLOSEcosystemService.DTO.Things;
using System;
using System.ComponentModel.DataAnnotations;

namespace OWLOSEcosystemService.Models.Things
{

    public class ThingAirQualityModel
    {
        [Key]
        public int id { get; set; }
        public ThingAirQualityStatus Status { get; set; } = ThingAirQualityStatus.Error;
        public DateTime QueryTime { get; set; }
        public bool DHT22 { get; set; }
        public float DHT22hum { get; set; }
        public float DHT22heat { get; set; }
        public bool DHT22c { get; set; }
        public bool BMP280 { get; set; }
        public float BMP280pressure { get; set; }
        public float BMP280altitude { get; set; }
        public float BMP280temperature { get; set; }

        public bool ADS1X15 { get; set; }
        public float ADS1X15MQ135 { get; set; }
        public float ADS1X15MQ7 { get; set; }
        public float ADS1X15Light { get; set; }

        public bool CCS811 { get; set; }
        public float CCS811CO2 { get; set; }
        public float CCS811TVOC { get; set; }
        public float CCS811resistence { get; set; }
        public float CCS811temp { get; set; }


    }
}
