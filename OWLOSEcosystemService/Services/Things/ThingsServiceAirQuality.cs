using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;

namespace OWLOSEcosystemService.Services.Things
{
    public partial class ThingsService : IThingsService
    {
        private const string DHT22SensorName = "dht22";
        private const string BMP280SensorName = "bmp280";
        private const string ADS1X15SensorName = "ads1x15";
        private const string CSS811SensorName = "css811";

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
                    //_thingsRepository.AddAirQuality(UserId, ThingId, result);
                    break;
                }
            }
            return result;
        }


        private bool AirQualityPropKeyToModel(string dataProp, ThingAirQualityModel airQualityModel)
        {
            if (dataProp.IndexOf(":") != -1)
            {
                string key = dataProp.Substring(0, dataProp.IndexOf(":"));
                string value = dataProp.Substring(dataProp.IndexOf(":") + 1);

                Type airQualityModelType = airQualityModel.GetType();

                PropertyInfo propertyInfo = airQualityModelType.GetProperty(key);

                if (propertyInfo == null)
                {
                    return false;
                }

                if (propertyInfo.PropertyType == typeof(bool))
                {
                    if (value.ToLower().Equals("yes") || value.ToLower().Equals("true"))
                    {
                        propertyInfo.SetValue(airQualityModel, true, null);
                    }
                    else
                    {
                        propertyInfo.SetValue(airQualityModel, false, null);
                    }
                    return true;
                }
                else 
                if (propertyInfo.PropertyType == typeof(float))
                {
                    float floatValue;                    
                    if (float.TryParse(value, System.Globalization.NumberStyles.Any, CultureInfo.InvariantCulture, out floatValue))
                    {
                        propertyInfo.SetValue(airQualityModel, floatValue, null);
                        return true;
                    }
                    else
                    {
                        propertyInfo.SetValue(airQualityModel, float.NaN, null);
                        return true;
                    }
                }
                else //string 
                {
                    propertyInfo.SetValue(airQualityModel, value, null);
                    return true;
                }
             }
            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public string AirQualityDataToThing(string data)
        {

            string result = string.Empty;

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


            Guid tokenGuid = Guid.Parse(token);

            ThingConnectionPropertiesDTO thingConnectionProperties = _thingsRepository.GetThingConnectionByToken(tokenGuid);

            if (thingConnectionProperties == null)
            {
                return "Bad token";
            }

            

            if (topic.IndexOf("AirQuality") != -1)
            {
                ThingAirQualityModel airQualityModel = new ThingAirQualityModel
                {
                    Status = ThingAirQualityStatus.OnlineWithError
                };

                NumberStyles styles = NumberStyles.Float;
                IFormatProvider provider = CultureInfo.CreateSpecificCulture("en-EN");                

                foreach (string dataProp in dataRaw)
                {
                    if (string.IsNullOrEmpty(dataProp))
                    {
                        continue;
                    }

                    try
                    {
                        if (!AirQualityPropKeyToModel(dataProp, airQualityModel))
                        {
                            result += "bad key-value: " + dataProp + "\n";
                        }
                    }
                    catch (Exception e)
                    {
                        result += "bad key-value: " + dataProp + " " + e.Message+ "\n";
                    }
                }
                airQualityModel.Status = ThingAirQualityStatus.Online;
                return SetAirQualityModelToThing(thingConnectionProperties.UserId, thingConnectionProperties.Id, airQualityModel);
            }

            return result;
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
                    OWLOSDriverProperty property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("available"));
                    property.SetOutside("1");

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("temperature"));
                    property.SetOutside(airQualityModel.DHT22temp.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("temperaturehistorydata"));
                    property.SetOutside(airQualityModel.DHT22temph);

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("humidity"));
                    property.SetOutside(airQualityModel.DHT22hum.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("humidityhistorydata"));
                    property.SetOutside(airQualityModel.DHT22humh);

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("heatindex"));
                    property.SetOutside(airQualityModel.DHT22heat.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("heatindexhistorydata"));
                    property.SetOutside(airQualityModel.DHT22heath);

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("celsius"));
                    if (airQualityModel.DHT22c)
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


            }
            //TEMPORARY
            airQualityModel.QueryTime = DateTime.Now;
            _thingsRepository.AddAirQuality(UserId, thingId, airQualityModel);
            return string.Empty;
        }
    }
}
