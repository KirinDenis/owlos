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
    /*
     !Глобально для системы выбирается квант времени, например - одна минута!


    OWLOS Thing 
    - Раз в минуту собирает показания сенсоров. 
    - Фиксирует millis() (TickCount)
    - Ведет History в течении десяти минут.
    - Фиксирует время history если есть источник времени (интернет или часы реального времемни)
    - Если нет часов, при перезагрузке сбрасывает накопленную истотию. 

    - Пропбует отправить раз в минуту собранные данные серверу без истории
    -- Если данные удалось отпавить ждет следующей сессии минуту. 
    -- Если данные не удалось отправить пропускает 1 сессий, в следующий раз пробует отправить 
       данные с иторией за десять последних минут. 
       --- если сново не удалось, начинает повторять попытки пропуская по дной сессии (раз в две минуты)


    OWLOS Ecosystem Service
    На стороне транспорта (Контроллера):
    - ожидает данных от клиента. 
    - когда данные пришли, фиксирует в объектной модели:
    -- дату и время получения данных.
    -- TickCount контролеера когда эти данные получены. 
    -- Если хистори данные получены - сохраняет их. 
    -- Если не получены и время по сравнению с предидущем запросом минута + 10 секунд - дописывает историю в объектную модель. 
    -- Если истоиря пришла от OWLOS Thing сохраняется она. 

    На стороне потока:
    - раз в минуту опрашивает каждый контроллер в объекной моделе. 
    - оценивает был ли контроллер Online в течении последней минуты. 
    -- если был онлайн и предидущая запись онлайн добавляет данные в репозиторий, с флагом контроллер онлайн. 
    -- если был онлайн и предидущая запись оффлайн добавляет данные в репозиторий, с флагом контроллер онлайн. 
       --- проверят время последнего запросов и сравнивает тик какунты с полседним успешным запросом - пробует 
       восстановить оффлайн данные по показаниям из истории. 
    -- если был оффлайн, добавляет данные о том что оффлайн. 

     */


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
        public ThingAirQualityDTO GetThingAirQualityDTO(Guid UserId, int ThingId)
        {
            ThingAirQualityDTO result = null;

            foreach (OWLOSThingWrapper thingWrapper in thingsManager.OWLOSThingWrappers)
            {
                if ((thingWrapper.Thing.config.UserId.Equals(UserId)) && (thingWrapper.Thing.config.DbId == ThingId))
                {
                    
                    if ((thingWrapper.Thing.drivers == null) || (thingWrapper.Thing.drivers.Count == 0) || (thingWrapper.Thing.lastAirQulityRecievedData == null))
                    {
                        break;
                    }

                    result = thingWrapper.Thing.lastAirQulityRecievedData as ThingAirQualityDTO;

                    break;
                }
            }
            return result;
        }


        private bool AirQualityPropKeyToModel(string dataProp, ThingAirQualityDTO airQualityDTO)
        {
            if (dataProp.IndexOf(":") != -1)
            {
                string key = dataProp.Substring(0, dataProp.IndexOf(":"));
                string value = dataProp.Substring(dataProp.IndexOf(":") + 1);

                Type airQualityDTOType = airQualityDTO.GetType();

                PropertyInfo propertyInfo = airQualityDTOType.GetProperty(key);

                if (propertyInfo == null)
                {
                    return false;
                }

                if (propertyInfo.PropertyType == typeof(bool))
                {
                    if (value.ToLower().Equals("yes") || value.ToLower().Equals("true"))
                    {
                        propertyInfo.SetValue(airQualityDTO, true, null);
                    }
                    else
                    {
                        propertyInfo.SetValue(airQualityDTO, false, null);
                    }
                    return true;
                }
                else
                if ((propertyInfo.PropertyType == typeof(float)) || (propertyInfo.PropertyType == typeof(float?)))
                {
                    float floatValue;
                    if (float.TryParse(value, System.Globalization.NumberStyles.Any, CultureInfo.InvariantCulture, out floatValue))
                    {
                        propertyInfo.SetValue(airQualityDTO, floatValue, null);
                        return true;
                    }
                    else
                    {
                        propertyInfo.SetValue(airQualityDTO, null, null);
                        return true;
                    }
                }
                else
                if (propertyInfo.PropertyType == typeof(long))
                {
                    long longValue;
                    if (long.TryParse(value, out longValue))
                    {
                        propertyInfo.SetValue(airQualityDTO, longValue, null);
                        return true;
                    }
                    else
                    {
                        propertyInfo.SetValue(airQualityDTO, null, null);
                        return true;
                    }
                }
                else
                if (propertyInfo.PropertyType == typeof(int))
                {
                    int intValue;
                    if (int.TryParse(value, out intValue))
                    {
                        propertyInfo.SetValue(airQualityDTO, intValue, null);
                        return true;
                    }
                    else
                    {
                        propertyInfo.SetValue(airQualityDTO, null, null);
                        return true;
                    }
                }
                else //string 
                {
                    propertyInfo.SetValue(airQualityDTO, value, null);
                    //check is exists history
                    if (key.IndexOf("HD") != -1)
                    {
                        if ((!string.IsNullOrEmpty(value)) && (value.IndexOf(";") != -1))
                        {
                            airQualityDTO.hasHistory = true;
                        }
                    }
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
                ThingAirQualityDTO airQualityDTO = new ThingAirQualityDTO
                {
                    Status = ThingAirQualityStatus.OnlineWithError
                };

                airQualityDTO.UserId = thingConnectionProperties.UserId;
                airQualityDTO.ThingId = thingConnectionProperties.Id;

                airQualityDTO.QueryTime = DateTime.Now;
                airQualityDTO.TickCount = long.Parse(dataRaw[3].Substring(dataRaw[3].IndexOf(":") + 1));

                foreach (string dataProp in dataRaw)
                {
                    if (string.IsNullOrEmpty(dataProp))
                    {
                        continue;
                    }

                    try
                    {
                        if (!AirQualityPropKeyToModel(dataProp, airQualityDTO))
                        {
                            result += "bad key-value: " + dataProp + "\n";
                        }
                    }
                    catch (Exception e)
                    {
                        result += "bad key-value: " + dataProp + " " + e.Message + "\n";
                    }
                }
                airQualityDTO.Status = ThingAirQualityStatus.Online;
                return SetAirQualityModelToThing(thingConnectionProperties.UserId, thingConnectionProperties.Id, airQualityDTO);
            }

            return result;
        }

        private void HistoryDataToDriverHistoryProperty(OWLOSDriverProperty property, string value, string historyValue, HistoryAction historyAction)
        {
            switch (historyAction)
            {
                case HistoryAction.Clean: property.SetOutside(string.Empty); break;
                case HistoryAction.Replace: property.SetOutside(historyValue); break;
                case HistoryAction.Аdd:
                    
                    List<string> valuesList = property.value.Split(';').ToList();
                    //by default 30 values with data and first value is counter 
                    if (valuesList.Count >= 31)
                    {
                        valuesList.RemoveAt(1);
                        valuesList.Add(value);
                    }
                    else
                    {
                        if (valuesList.Count == 31) //empty history
                        {
                            valuesList.Add("1");
                            valuesList.Add(value);
                        }
                        else
                        {
                            valuesList[0] = (valuesList.Count + 1).ToString();
                            valuesList.Add(value);
                        }
                    }
                    string newHistory = string.Empty;
                    foreach(string newValue in valuesList)
                    {
                        newHistory += newValue + ";";
                    }
                    property.SetOutside(newHistory);
                    break;
                default: break; //default nothing
            }
        }

        /// <summary>
        /// Analise previously thing statuses and data and update thing object model properties
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="thingId"></param>
        /// <param name="airQualityDTO"></param>
        /// <returns></returns>
        private string SetAirQualityModelToThing(Guid UserId, int thingId, ThingAirQualityDTO airQualityDTO)
        {
            OWLOSThingWrapper thingWrapper = thingsManager.GetThingWrapperById(thingId);
            if ((thingWrapper != null) && (thingWrapper.Thing != null))
            {
                //thing found
                //Analise last network status and timing 
                HistoryAction historyAction = HistoryAction.Nothing;

                if (airQualityDTO.hasHistory)
                {
                    //if history is present and thing controller lost tick count or last session time up to 9 minutes
                    if (thingWrapper.Thing.lastSessionTime != null)
                    {
                        if ((airQualityDTO.TickCount < thingWrapper.Thing.thingTickCount) || (airQualityDTO.QueryTime?.Subtract(((DateTime)thingWrapper.Thing.lastSessionTime)).TotalMinutes > 9))
                        {
                            historyAction = HistoryAction.Replace;
                        }
                    }
                    else //it is first session 
                    {
                        historyAction = HistoryAction.Replace;
                    }
                    //else - default - do nothing ? or replace?
                }
                else
                {
                    //if history NOT present and thing controller lost tick count or last session time up to 9 minutes
                    if (thingWrapper.Thing.lastSessionTime != null)
                    {
                        if ((airQualityDTO.TickCount < thingWrapper.Thing.thingTickCount) || (airQualityDTO.QueryTime?.Subtract((DateTime)thingWrapper.Thing.lastSessionTime).TotalMinutes > 9))
                        {
                            //controller is reboot and we have no history 
                            historyAction = HistoryAction.Clean;
                        }
                        else
                        {
                            historyAction = HistoryAction.Аdd;
                        }
                    }
                    //else nothing to do with local copy of history
                }

                //update thing object model statuses 
                thingWrapper.Thing.networkStatus = NetworkStatus.Online;
                thingWrapper.Thing.lastSessionTime = airQualityDTO.QueryTime;
                thingWrapper.Thing.thingTickCount = airQualityDTO.TickCount;

                thingWrapper.Thing.lastAirQulityRecievedData = airQualityDTO;

                //--- DHT22 
                OWLOSDriver dhtDriver = thingWrapper.Thing.drivers.FirstOrDefault<OWLOSDriver>(d => d.name.Equals(DHT22SensorName));
                if (dhtDriver != null)
                {
                    OWLOSDriverProperty property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("available"));
                    property.SetOutside("1");

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("temperature"));
                    property.SetOutside(airQualityDTO.DHT22temp.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("temperaturehistorydata"));
                    HistoryDataToDriverHistoryProperty(property, airQualityDTO.DHT22temp.ToString(), airQualityDTO.DHT22tempHD, historyAction);

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("humidity"));
                    property.SetOutside(airQualityDTO.DHT22hum.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("humidityhistorydata"));
                    HistoryDataToDriverHistoryProperty(property, airQualityDTO.DHT22hum.ToString(), airQualityDTO.DHT22humHD, historyAction);
                    
                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("heatindex"));
                    property.SetOutside(airQualityDTO.DHT22heat.ToString());

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("heatindexhistorydata"));
                    HistoryDataToDriverHistoryProperty(property, airQualityDTO.DHT22heat.ToString(), airQualityDTO.DHT22heatHD, historyAction);

                    property = dhtDriver.properties.FirstOrDefault<OWLOSDriverProperty>(p => p.name.Equals("celsius"));
                    if ((airQualityDTO.DHT22c != null) && ((bool)airQualityDTO.DHT22c))
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
            airQualityDTO.QueryTime = DateTime.Now;
            
            return string.Empty;
        }
    }
}
