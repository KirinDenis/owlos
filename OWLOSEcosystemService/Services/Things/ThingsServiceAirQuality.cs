using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

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

        public string ReceiveAirQualityData(string data)
        {

            List<string> dataRaw = data.Split('\n').ToList();

            if (dataRaw.Count < 3)
            {
                return "Bad data raw format";
            }

            if (!dataRaw[0].StartsWith("topic:"))
            {
                return "Bad data raw format, wrong topic key";
            }

            if (!dataRaw[1].StartsWith("token:"))
            {
                return "Bad data raw format, wrong token key";
            }

            string topic = dataRaw[0].Substring(dataRaw[0].IndexOf(":") + 1);
            string token = dataRaw[1].Substring(dataRaw[1].IndexOf(":") + 1);


            ThingTokenDTO thingTokenDTO = DecodeThingToken(token);

            if (!_thingsRepository.CheckToken(thingTokenDTO))
            {
                return "Bad token";
            }



            //TODO: Sensors personal trap and query topics processing

            if (topic.IndexOf("AirQuality") != -1)
            {
                ThingAirQualityModel airQualityModel = new ThingAirQualityModel();

                NumberStyles styles = NumberStyles.Float;
                IFormatProvider provider = CultureInfo.CreateSpecificCulture("en-EN");

                foreach (string dataProp in dataRaw)
                {
                    if (string.IsNullOrEmpty(dataProp))
                    {
                        continue;
                    }

                    if (dataProp.IndexOf(":") != -1)
                    {
                        string key = dataProp.Substring(0, dataProp.IndexOf(":"));
                        string value = dataProp.Substring(dataProp.IndexOf(":") + 1);
                        if (key.Equals("DHT22"))
                        {
                            if (value.Equals("yes"))
                            {
                                airQualityModel.DHTSensor.Exists = true;
                            }
                            else
                            {
                                airQualityModel.DHTSensor.Exists = true;
                            }
                        }

                        if (key.Equals("DHT22temp"))
                        {
                            airQualityModel.DHTSensor.Temperature = double.Parse(value, styles, provider);
                        }

                        if (key.Equals("DHT22hum"))
                        {
                            airQualityModel.DHTSensor.Humidity = double.Parse(value, styles, provider);
                        }

                        if (key.Equals("DHT22heat"))
                        {
                            airQualityModel.DHTSensor.HeatIndex = double.Parse(value, styles, provider);
                        }

                        if (key.Equals("DHT22c"))
                        {
                            if (value.Equals("1"))
                            {
                                airQualityModel.DHTSensor.Celsius = true;
                            }
                            else
                            {
                                airQualityModel.DHTSensor.Celsius = false;
                            }
                        }
                    }
                    else
                    {
                        return "Data format parsing problem, wrong key:value syntax";
                    }
                }
                return AirQualityToThing(thingTokenDTO.UserId, thingTokenDTO.ThingId, airQualityModel);
            }

           return string.Empty;
        }

        private string AirQualityToThing(Guid UserId, int thingId, ThingAirQualityModel airQualityModel)
        {
            OWLOSThingWrapper thingWrapper = thingsManager.GetThingWrapperById(thingId);
            if ((thingWrapper != null) && (thingWrapper.Thing != null))
            {
                OWLOSDriver dhtDriver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals("dht22"));
                if (dhtDriver != null)
                {
                    OWLOSDriverProperty property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("temperature"));
                    property.SetOutside(airQualityModel.DHTSensor.Temperature.ToString());
                }   
                else
                {
                    return "Thing not ready or not initialized";
                }

            }
            return string.Empty;
        }
    }
}
