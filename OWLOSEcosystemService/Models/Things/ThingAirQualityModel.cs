using System;
using System.ComponentModel.DataAnnotations;

namespace OWLOSEcosystemService.Models.Things
{
    public enum ThingAirQualityStatus {Online, Offline, OnlineWithError, Error}
    public class ThingSensor
    {
        [Key]
        public int id { get; set; }

        public bool Exists { get; set; } = false;
        public double Value { get; set; } 
        public string ValueHistory { get; set; } = string.Empty;
    }

    public class ThingDHTSensor
    {
        [Key]
        public int id { get; set; }
        public bool Exists { get; set; } = false;
        public bool Celsius { get; set; } = true;
        public double Temperature { get; set; } 
        public string TemperatureHistory { get; set; } = string.Empty;
        public double Humidity { get; set; }
        public string HumidityHistory { get; set; } = string.Empty;
        public double HeatIndex { get; set; }
        public string HeatIndexHistory { get; set; } = string.Empty;
    }

    public class ThingAirQualityModel
    {
        [Key]
        public int id { get; set; }
        public ThingAirQualityStatus Status { get; set; } = ThingAirQualityStatus.Error;
        public DateTime QueryTime { get; set; }
        public ThingDHTSensor DHTSensor { get; set; } = new ThingDHTSensor();
        public ThingSensor LightSensor { get; set; } = new ThingSensor();
        public ThingSensor ResistorSensor { get; set; } = new ThingSensor();
        public ThingSensor MQ7Sensor { get; set; } = new ThingSensor();
        public ThingSensor MotionSensor { get; set; } = new ThingSensor();
    }
}
