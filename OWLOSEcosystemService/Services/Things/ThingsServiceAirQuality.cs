using OWLOSEcosystemService.Models.Things;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Globalization;

namespace OWLOSEcosystemService.Services.Things
{
    public partial class ThingsService : IThingsService
    {
        private const string DHTSensorName = "dht22";
        private const string MQ7SensorName = "gas_mq7";
        private const string LightSensorName = "s24";

        public ThingAirQualityModel GetAirQuality(Guid UserId, int ThingId)
        {
            ThingAirQualityModel result = new ThingAirQualityModel();

            foreach (OWLOSThingWrapper wrapper in thingsManager.OWLOSThingWrappers)
            {
                if ((wrapper.Thing.config.UserId.Equals(UserId)) && (wrapper.Thing.config.DbId == ThingId))
                {
                    result.Status = "OFFLINE";

                    if ((wrapper.Thing.drivers == null) || (wrapper.Thing.drivers.Count == 0))
                    {
                        break;
                    }

                    NumberStyles styles = NumberStyles.Float;
                    IFormatProvider provider = CultureInfo.CreateSpecificCulture("en-EN");

                    result.Status = "ONLINE";
                    result.QueryTime = DateTime.Now;
                    foreach (OWLOSDriver driver in wrapper.Thing.drivers)
                    {
                        if (driver.name.Equals(DHTSensorName))
                        {
                            result.DHTSensor.Exists = true;

                            if (driver.properties.Find(p => p.name.Equals("celsius")).value.Equals("1"))
                            {
                                result.DHTSensor.Celsius = true;
                            }
                            else
                            {
                                result.DHTSensor.Celsius = false;
                            }

                            result.DHTSensor.Temperature = double.Parse( driver.properties.Find(p => p.name.Equals("temperature")).value, styles, provider);
                            result.DHTSensor.TemperatureHistory = driver.properties.Find(p => p.name.Equals("temperaturehistorydata")).value;

                            result.DHTSensor.Humidity = double.Parse(driver.properties.Find(p => p.name.Equals("humidity")).value, styles, provider);
                            result.DHTSensor.HumidityHistory = driver.properties.Find(p => p.name.Equals("humidityhistorydata")).value;

                            result.DHTSensor.HeatIndex = double.Parse(driver.properties.Find(p => p.name.Equals("heatindex")).value, styles, provider);
                            result.DHTSensor.HeatIndexHistory = driver.properties.Find(p => p.name.Equals("heatindexhistorydata")).value;
                        }

                        if (driver.name.Equals(MQ7SensorName))
                        {
                            result.MQ7Sensor.Exists = true;
                            result.MQ7Sensor.Value = double.Parse(driver.properties.Find(p => p.name.Equals("data")).value, styles, provider);
                            result.MQ7Sensor.ValueHistory = driver.properties.Find(p => p.name.Equals("historydata")).value;
                        }

                        if (driver.name.Equals(LightSensorName))
                        {
                            result.LightSensor.Exists = true;
                            result.LightSensor.Value = double.Parse(driver.properties.Find(p => p.name.Equals("data")).value, styles, provider);
                            result.LightSensor.ValueHistory = driver.properties.Find(p => p.name.Equals("historydata")).value;
                        }
                    }

                    _thingsRepository.AddAirQuality(UserId, ThingId, result);

                    break;
                }
            }


            return result;
        }
    }
}
