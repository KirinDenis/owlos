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
        private const string DHT22SensorName = "dht22";
        private const string LightSensorName = "light";
        private const string ResistorSensorName = "resistor";
        private const string MQ7SensorName = "mq7";
        private const string MotionSensorName = "motion";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="ThingId"></param>
        /// <returns></returns>
        public ThingAirQualityModel GetThingAirQualityModel(Guid UserId, int ThingId)
        {
            ThingAirQualityModel result = new ThingAirQualityModel();

            foreach (OWLOSThingWrapper thingWrapper in thingsManager.OWLOSThingWrappers)
            {
                if ((thingWrapper.Thing.config.UserId.Equals(UserId)) && (thingWrapper.Thing.config.DbId == ThingId))
                {
                    result.Status = ThingAirQualityStatus.Offline;

                    if ((thingWrapper.Thing.drivers == null) || (thingWrapper.Thing.drivers.Count == 0))
                    {
                        break;
                    }

                    NumberStyles styles = NumberStyles.Float;
                    IFormatProvider provider = CultureInfo.CreateSpecificCulture("en-EN");

                    result.Status = ThingAirQualityStatus.Online;
                    result.QueryTime = DateTime.Now;

                    //--- DHT22
                    OWLOSDriver driver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(DHT22SensorName));
                    if ((driver != null) && (driver.properties.Find(p => p.name.Equals("available")).value.Equals("1")))
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

                            result.DHTSensor.Temperature = double.Parse(driver.properties.Find(p => p.name.Equals("temperature")).value, styles, provider);
                            result.DHTSensor.TemperatureHistory = driver.properties.Find(p => p.name.Equals("temperaturehistorydata")).value;

                            result.DHTSensor.Humidity = double.Parse(driver.properties.Find(p => p.name.Equals("humidity")).value, styles, provider);
                            result.DHTSensor.HumidityHistory = driver.properties.Find(p => p.name.Equals("humidityhistorydata")).value;

                            result.DHTSensor.HeatIndex = double.Parse(driver.properties.Find(p => p.name.Equals("heatindex")).value, styles, provider);
                            result.DHTSensor.HeatIndexHistory = driver.properties.Find(p => p.name.Equals("heatindexhistorydata")).value;
                    }
                    else
                    {
                        result.Status = ThingAirQualityStatus.OnlineWithError;
                    }
                    //ENDOF DHT22 ---

                    //--- Light 
                    driver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(LightSensorName));
                    if ((driver != null) && (driver.properties.Find(p => p.name.Equals("available")).value.Equals("1")))
                    {
                        result.LightSensor.Exists = true;
                        result.LightSensor.Value = double.Parse(driver.properties.Find(p => p.name.Equals("data")).value, styles, provider);
                        result.LightSensor.ValueHistory = driver.properties.Find(p => p.name.Equals("historydata")).value;
                    }
                    else
                    {
                        result.Status = ThingAirQualityStatus.OnlineWithError;
                    }
                    //ENDOF Light ---

                    //--- Resistor 
                    driver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(ResistorSensorName));
                    if ((driver != null) && (driver.properties.Find(p => p.name.Equals("available")).value.Equals("1")))
                    {
                        result.ResistorSensor.Exists = true;
                        result.ResistorSensor.Value = double.Parse(driver.properties.Find(p => p.name.Equals("data")).value, styles, provider);
                        result.ResistorSensor.ValueHistory = driver.properties.Find(p => p.name.Equals("historydata")).value;
                    }
                    else
                    {
                        result.Status = ThingAirQualityStatus.OnlineWithError;
                    }
                    //ENDOF Resistor ---

                    //--- MQ7 
                    driver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(MQ7SensorName));
                    if ((driver != null) && (driver.properties.Find(p => p.name.Equals("available")).value.Equals("1")))
                    {
                        result.MQ7Sensor.Exists = true;
                        result.MQ7Sensor.Value = double.Parse(driver.properties.Find(p => p.name.Equals("data")).value, styles, provider);
                        result.MQ7Sensor.ValueHistory = driver.properties.Find(p => p.name.Equals("historydata")).value;
                    }
                    else
                    {
                        result.Status = ThingAirQualityStatus.OnlineWithError;
                    }
                    //ENDOF MQ7 ---

                    //--- Motion 
                    driver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(MotionSensorName));
                    if ((driver != null) && (driver.properties.Find(p => p.name.Equals("available")).value.Equals("1")))
                    {
                        result.MotionSensor.Exists = true;
                        result.MotionSensor.Value = double.Parse(driver.properties.Find(p => p.name.Equals("data")).value, styles, provider);
                        result.MotionSensor.ValueHistory = driver.properties.Find(p => p.name.Equals("historydata")).value;
                    }
                    else
                    {
                        result.Status = ThingAirQualityStatus.OnlineWithError;
                    }
                    //ENDOF Motion ---

                    _thingsRepository.AddAirQuality(UserId, ThingId, result);
                    break;
                }
            }
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public string AirQualityDataToThing(string data)
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
                airQualityModel.Status = ThingAirQualityStatus.OnlineWithError;

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
                        //--- DHT22 
                        if (key.StartsWith("DHT22"))
                        {
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
                            //DHT22 Yes/No key must be first, release other DHT22 only if sensor available 
                            if (airQualityModel.DHTSensor.Exists)
                            {
                                if (key.Equals("DHT22temp"))
                                {
                                    airQualityModel.DHTSensor.Temperature = double.Parse(value, styles, provider);
                                }
                                else
                                if (key.Equals("DHT22temph"))
                                {
                                    airQualityModel.DHTSensor.TemperatureHistory = value;
                                }
                                else
                                if (key.Equals("DHT22hum"))
                                {
                                    airQualityModel.DHTSensor.Humidity = double.Parse(value, styles, provider);
                                }
                                else
                                if (key.Equals("DHT22humh"))
                                {
                                    airQualityModel.DHTSensor.HumidityHistory = value;
                                }
                                else
                                if (key.Equals("DHT22heat"))
                                {
                                    airQualityModel.DHTSensor.HeatIndex = double.Parse(value, styles, provider);
                                }
                                else
                                if (key.Equals("DHT22heath"))
                                {
                                    airQualityModel.DHTSensor.HeatIndexHistory = value;
                                }
                                else
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
                        }
                        //ENDOF DHT22 ---

                        //--- Light 
                        if (key.StartsWith("Light"))
                        {
                            if (key.Equals("Light"))
                            {
                                if (value.Equals("yes"))
                                {
                                    airQualityModel.LightSensor.Exists = true;
                                }
                                else
                                {
                                    airQualityModel.LightSensor.Exists = true;
                                }
                            }

                            if (airQualityModel.LightSensor.Exists)
                            {
                                if (key.Equals("Lightdata"))
                                {
                                    airQualityModel.LightSensor.Value = double.Parse(value, styles, provider);
                                }
                                else
                                if (key.Equals("Lightdatah"))
                                {
                                    airQualityModel.LightSensor.ValueHistory = value;
                                }
                            }
                        }
                        //ENDОF Light 

                        //--- Resistor 
                        if (key.StartsWith("Resistor"))
                        {
                            if (key.Equals("Resistor"))
                            {
                                if (value.Equals("yes"))
                                {
                                    airQualityModel.ResistorSensor.Exists = true;
                                }
                                else
                                {
                                    airQualityModel.ResistorSensor.Exists = true;
                                }
                            }

                            if (airQualityModel.ResistorSensor.Exists)
                            {
                                if (key.Equals("Resistordata"))
                                {
                                    airQualityModel.ResistorSensor.Value = double.Parse(value, styles, provider);
                                }
                                else
                                if (key.Equals("Resistordatah"))
                                {
                                    airQualityModel.ResistorSensor.ValueHistory = value;
                                }
                            }
                        }
                        //ENDOF Resistor 

                        //--- MQ7
                        if (key.StartsWith("MQ7"))
                        {
                            if (key.Equals("MQ7"))
                            {
                                if (value.Equals("yes"))
                                {
                                    airQualityModel.MQ7Sensor.Exists = true;
                                }
                                else
                                {
                                    airQualityModel.MQ7Sensor.Exists = true;
                                }
                            }

                            if (airQualityModel.MQ7Sensor.Exists)
                            {
                                if (key.Equals("MQ7data"))
                                {
                                    airQualityModel.MQ7Sensor.Value = double.Parse(value, styles, provider);
                                }
                                else
                                if (key.Equals("MQ7datah"))
                                {
                                    airQualityModel.MQ7Sensor.ValueHistory = value;
                                }
                            }
                        }
                        //ENDOF MQ7 

                        //--- Motion
                        if (key.StartsWith("Motion"))
                        {
                            if (key.Equals("Motion"))
                            {
                                if (value.Equals("yes"))
                                {
                                    airQualityModel.MotionSensor.Exists = true;
                                }
                                else
                                {
                                    airQualityModel.MotionSensor.Exists = true;
                                }
                            }

                            if (airQualityModel.MotionSensor.Exists)
                            {
                                if (key.Equals("Motiondata"))
                                {
                                    airQualityModel.MotionSensor.Value = double.Parse(value, styles, provider);
                                }
                                else
                                if (key.Equals("Motiondatah"))
                                {
                                    airQualityModel.MotionSensor.ValueHistory = value;
                                }
                            }
                        }
                        //ENDOF Motion 
                    }
                    else
                    {
                        return "Data format parsing problem, wrong key:value syntax";
                    }
                }
                airQualityModel.Status = ThingAirQualityStatus.Online;
                return SetAirQualityModelToThing(thingTokenDTO.UserId, thingTokenDTO.ThingId, airQualityModel);
            }

            return string.Empty;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="thingId"></param>
        /// <param name="airQualityModel"></param>
        /// <returns></returns>
        private string SetAirQualityModelToThing(Guid UserId, int thingId, ThingAirQualityModel airQualityModel)
        {
            OWLOSThingWrapper thingWrapper = thingsManager.GetThingWrapperById(thingId);
            if ((thingWrapper != null) && (thingWrapper.Thing != null))
            {
                //--- DHT22 
                OWLOSDriver dhtDriver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(DHT22SensorName));
                if (dhtDriver != null)
                {
                    OWLOSDriverProperty property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("temperature"));
                    property.SetOutside(airQualityModel.DHTSensor.Temperature.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("temperaturehistorydata"));
                    property.SetOutside(airQualityModel.DHTSensor.TemperatureHistory);

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("humidity"));
                    property.SetOutside(airQualityModel.DHTSensor.Humidity.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("humidityhistorydata"));
                    property.SetOutside(airQualityModel.DHTSensor.HumidityHistory);

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("heatindex"));
                    property.SetOutside(airQualityModel.DHTSensor.HeatIndex.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("heatindexhistorydata"));
                    property.SetOutside(airQualityModel.DHTSensor.HeatIndexHistory);

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("celsius"));
                    if (airQualityModel.DHTSensor.Celsius)
                    {
                        property.SetOutside("1");
                    }
                    else
                    {
                        property.SetOutside("0");
                    }
                }
                else
                {
                    return "Wrong DHT22 Sensor. Thing not ready or not initialized.";
                }
                //ENDOF DHT22

                //--- Light 
                OWLOSDriver LightDriver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(LightSensorName));
                if (LightDriver != null)
                {
                    OWLOSDriverProperty property = LightDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("data"));
                    property.SetOutside(airQualityModel.LightSensor.Value.ToString());

                    property = LightDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("historydata"));
                    property.SetOutside(airQualityModel.LightSensor.ValueHistory);
                }
                else
                {
                    return "Wrong Light Sensor. Thing not ready or not initialized.";
                }
                //ENDOF Light ---

                //--- Resistor 
                OWLOSDriver ResistorDriver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(ResistorSensorName));
                if (ResistorDriver != null)
                {
                    OWLOSDriverProperty property = ResistorDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("data"));
                    property.SetOutside(airQualityModel.ResistorSensor.Value.ToString());

                    property = ResistorDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("historydata"));
                    property.SetOutside(airQualityModel.ResistorSensor.ValueHistory);
                }
                else
                {
                    return "Wrong Resistor Sensor. Thing not ready or not initialized.";
                }
                //ENDOF Resistor ---

                //--- MQ7 
                OWLOSDriver MQ7Driver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(MQ7SensorName));
                if (MQ7Driver != null)
                {
                    OWLOSDriverProperty property = MQ7Driver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("data"));
                    property.SetOutside(airQualityModel.MQ7Sensor.Value.ToString());

                    property = MQ7Driver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("historydata"));
                    property.SetOutside(airQualityModel.MQ7Sensor.ValueHistory);
                }
                else
                {
                    return "Wrong MQ7 Sensor. Thing not ready or not initialized.";
                }
                //ENDOF MQ7 ---

                //--- Motion 
                OWLOSDriver MotionDriver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(MotionSensorName));
                if (MotionDriver != null)
                {
                    OWLOSDriverProperty property = MotionDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("data"));
                    property.SetOutside(airQualityModel.MotionSensor.Value.ToString());

                    property = MotionDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("historydata"));
                    property.SetOutside(airQualityModel.MotionSensor.ValueHistory);
                }
                else
                {
                    return "Wrong Motion Sensor. Thing not ready or not initialized.";
                }
                //ENDOF Motion ---

            }
            return string.Empty;
        }
    }
}
