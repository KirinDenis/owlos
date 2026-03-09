using OWLOSEcosystemService.DTO.Things;
using System;
using System.ComponentModel.DataAnnotations;

namespace OWLOSEcosystemService.Models.Things
{

    public class ThingAirQualityModel
    {
        [Key]
        public int id { get; set; }

        public int ThingId { get; set; }
        public ThingAirQualityStatus Status { get; set; } = ThingAirQualityStatus.Error;
        public DateTime? QueryTime { get; set; } = null;
        public long? TickCount { get; set; } = null;

        public bool DHT22 { get; set; } = false;
        public float? DHT22temp { get; set; } = null;
        public float? DHT22hum { get; set; } = null;
        public float? DHT22heat { get; set; } = null;
        public bool DHT22c { get; set; } = false;

        public bool BMP280 { get; set; } = false;
        public float? BMP280pressure { get; set; } = null;
        public float? BMP280altitude { get; set; } = null;
        public float? BMP280temperature { get; set; } = null;

        public bool ADS1X15 { get; set; } = false;
        public float? ADS1X15MQ135 { get; set; } = null;
        public float? ADS1X15MQ7 { get; set; } = null;
        public float? ADS1X15Light { get; set; } = null;

        public bool CCS811 { get; set; } = false;
        public float? CCS811CO2 { get; set; } = null;
        public float? CCS811TVOC { get; set; } = null;
        public float? CCS811resistence { get; set; } = null;
        public float? CCS811temp { get; set; } = null;


    }
}
