/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/


using Newtonsoft.Json;
using OWLOSAirQuality.Huds;
using OWLOSEcosystemService.DTO.Things;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Timers;

namespace OWLOSAirQuality.OWLOSEcosystemService
{

    public class OWLOSLogEventArgs : EventArgs
    {
        public string Message;
        public ConsoleMessageCode EventType;
        
        public OWLOSLogEventArgs(string Message, ConsoleMessageCode EventType)
        {
            this.Message = Message;
            this.EventType = EventType;
        }
    }

    public class OWLOSEcosystem
    {
        private readonly OWLOSEcosystemClient ecosystemServiceClient;

        //        public string thingHost = "https://192.168.1.100:5004/Things/";

        //        public string thingToken = "M3ZDcS9NSiswMmxUWCs4Nmo1dUdUNEhlMEpETURjOUtpaXlIU3ZBb3k2RVFBQUFBc3hsREhxQVZiQkZqbGgyc2wrdlBWVXh2c0hYNitSTFRNS05jVWZLeEFraVNHSVZtaHdSWkk0UU8yYzhDalJJQ1daeEJsWnFGZElNaGJ6QUcrTXVjandjZThWZWxTMTFxcmNpaEc3QlhkRUxXYW13ZjhwWHY2THRxOHBkRVpBL1g2dHRkVFdyOXU1ZTZzVUt1RkU5SG9nPT0=";

        public string thingHost = "http://airquality.owlos.org/Things/";

        public string thingToken = "WG8xNTc1T29ONTFDbkdUd1NUOU1xVWRqVHhzbGIwOVJFN2xibU5RNnJpMFFBQUFBY3I4SERwTlVKWENsMjF4a1lWZG9OSlJBTDl0aDAwTWUzMk9ub2JYN2YvQUZmMWdESVZ1akE4c3NTUHcwbHkxWVc3bWd0N1JXcVVWTEZYQzRPajYwdTBIdFBVVHBFb0VjeXhyeGZCZWNDRVhmWWpzSTZDamxsdjAzR0dWY0JFL3dRSHZkL2llWE4wcmE4eFJsVFlFdmtRPT0%3D";


        public int quaryInterval = 10000;

        protected bool lifeCycleBlocked = false;

        protected Timer lifeCycleTimer;

        public const int dailyAirQulitySize = 60 * 24;

        public ThingAirQuality[] dailyAirQulity = new ThingAirQuality[dailyAirQulitySize];

        //events 
        public delegate void OWLOSLogEventHandler(object? sender, OWLOSLogEventArgs e);
        public event OWLOSLogEventHandler OnLog;
        
        public delegate void ACDataReadyEventHandler(object? sender, EventArgs e);
        public event ACDataReadyEventHandler OnACDataReady;


        public OWLOSEcosystem()
        {
            //initialize daily data 
            for (int i = 0; i < dailyAirQulitySize; i++)
            {
                JoinACData(i, new ThingAirQuality());
            }

            OnACDataReady?.Invoke(this, new EventArgs());

            ecosystemServiceClient = new OWLOSEcosystemClient();

            ecosystemServiceClient.OnLogItem += EcosystemServiceClient_OnLogItem;


            lifeCycleTimer = new Timer(quaryInterval)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();
            OnLifeCycleTimer(null, null);

        }


        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            if (lifeCycleBlocked)
            {
                return;
            }

            lifeCycleBlocked = true;

            Log(new OWLOSLogEventArgs("QUERY total [" + ecosystemServiceClient.totlaSend.ToString() + "]", ConsoleMessageCode.Info));

            AirQualityClientResulDTO airQualityClientResulDTO = await ecosystemServiceClient.GetLastDayThingAQ(thingHost, thingToken);
            if ((string.IsNullOrEmpty(airQualityClientResulDTO.error)) && (airQualityClientResulDTO.result != null))
            {
                List<ThingAirQuality> thingAirQuality = JsonConvert.DeserializeObject<List<ThingAirQuality>>(airQualityClientResulDTO.result as string);
                StoreDailyAirQualityData(thingAirQuality);

                Log(new OWLOSLogEventArgs("RECV total [" + ecosystemServiceClient.totlaRecv.ToString() + "]" , ConsoleMessageCode.Success));
            }
            else
            {
                Log(new OWLOSLogEventArgs("ERROR", ConsoleMessageCode.Danger));
            }

/*
            if ((ecosystemServiceClient.networkStatus != NetworkStatus.Online) && (ecosystemServiceClient.networkStatus != NetworkStatus.Reconnect))
            {
                AirQualityClientResulDTO airQualityClientResulDTO = await ecosystemServiceClient.GetLastDayThingAQ(thingHost, thingToken);
                if ((string.IsNullOrEmpty(airQualityClientResulDTO.error)) && (airQualityClientResulDTO.result != null))
                {
                    List<ThingAirQuality> thingAirQuality = JsonConvert.DeserializeObject<List<ThingAirQuality>>(airQualityClientResulDTO.result as string);
                    StoreDailyAirQualityData(thingAirQuality);                    
                }
                else
                {
                    StoreCurrentAirQualityData(new ThingAirQuality()
                    {
                        ClientTime = DateTime.Now,
                        Status = ThingAirQualityStatus.ServerNotConnected
                    });
                }

            }
            else
            {
                AirQualityClientResulDTO airQualityClientResulDTO = await ecosystemServiceClient.GetLastThingAQ(thingHost, thingToken);
                if ((string.IsNullOrEmpty(airQualityClientResulDTO.error)) && (airQualityClientResulDTO.result != null))
                {
                    ThingAirQuality thingAirQuality = JsonConvert.DeserializeObject<ThingAirQuality>(airQualityClientResulDTO.result as string);
                    StoreCurrentAirQualityData(thingAirQuality);

                }
                else
                {
                    StoreCurrentAirQualityData(new ThingAirQuality()
                    {
                        ClientTime = DateTime.Now,
                        Status = ThingAirQualityStatus.ServerNotConnected
                    });
                }
            }
*/

            lifeCycleBlocked = false;
        }

        /// <summary>
        /// Return one hour history data 
        /// </summary>
        /// <param name="hourOffset">current date time - ohurOffset, if zero is current hour history</param>
        /// <returns>ThingAirQualityHistoryData with history data arrays for each sensor (copy of dailyData)</returns>
        public ThingAirQualityHistoryData GetOneHourData(int hourOffset)
        {
            ThingAirQualityHistoryData result = new ThingAirQualityHistoryData
            {

                //public Guid UserId { get; set; } ?? waiting until not null?
                //public int ThingId { get; set; }

                Statuses = new ThingAirQualityStatus[60],
                QueryTime = new DateTime?[60],
                ClientTime = new DateTime?[60],
                TickCount = new long?[60],
                DHT22 = new bool[60],
                DHT22temp = new float?[60],
                DHT22hum = new float?[60],
                DHT22heat = new float?[60],
                BMP280pressure = new float?[60],
                BMP280altitude = new float?[60],
                BMP280temperature = new float?[60],
                ADS1X15MQ135 = new float?[60],
                ADS1X15MQ7 = new float?[60],
                ADS1X15Light = new float?[60],
                CCS811CO2 = new float?[60],
                CCS811TVOC = new float?[60],
                CCS811resistence = new float?[60],
                CCS811temperature = new float?[60]
            };


            int resultIndex = 0;
            for (int i = dailyAirQulitySize - (hourOffset + 1) * 60; i < dailyAirQulitySize - (hourOffset * 60); i++)
            {
                result.Statuses[resultIndex] = dailyAirQulity[i].Status;
                result.QueryTime[resultIndex] = dailyAirQulity[i].QueryTime;
                result.ClientTime[resultIndex] = dailyAirQulity[i].ClientTime;
                result.TickCount[resultIndex] = dailyAirQulity[i].TickCount;
                result.DHT22[resultIndex] = dailyAirQulity[i].DHT22;
                result.DHT22temp[resultIndex] = dailyAirQulity[i].DHT22temp;
                result.DHT22hum[resultIndex] = dailyAirQulity[i].DHT22hum;
                result.DHT22heat[resultIndex] = dailyAirQulity[i].DHT22heat;
                result.BMP280pressure[resultIndex] = dailyAirQulity[i].BMP280pressure;
                result.BMP280altitude[resultIndex] = dailyAirQulity[i].BMP280altitude;
                result.BMP280temperature[resultIndex] = dailyAirQulity[i].BMP280temperature;
                result.ADS1X15MQ135[resultIndex] = dailyAirQulity[i].ADS1X15MQ135;
                result.ADS1X15MQ7[resultIndex] = dailyAirQulity[i].ADS1X15MQ7;
                result.ADS1X15Light[resultIndex] = dailyAirQulity[i].ADS1X15Light;
                result.CCS811CO2[resultIndex] = dailyAirQulity[i].CCS811CO2;
                result.CCS811TVOC[resultIndex] = dailyAirQulity[i].CCS811TVOC;
                result.CCS811resistence[resultIndex] = dailyAirQulity[i].CCS811resistence;
                result.CCS811temperature[resultIndex] = dailyAirQulity[i].CCS811temp;
                resultIndex++;
            }

            return result;
        }

        /// <summary>
        /// Get daily data
        /// </summary>
        /// <param name="dayOffset">day offset until current date</param>
        /// <returns></returns>
        public ThingAirQualityHistoryData GetOneDayData(int dayOffset)
        {
            ThingAirQualityHistoryData result = new ThingAirQualityHistoryData();

            //every 10 minutes
            int dailyDataSize = 6 * 24; 

            result.Statuses = new ThingAirQualityStatus[dailyDataSize];
            result.QueryTime = new DateTime?[dailyDataSize];
            result.ClientTime = new DateTime?[dailyDataSize];
            result.TickCount = new long?[dailyDataSize];
            result.DHT22 = new bool[dailyDataSize];
            result.DHT22temp = new float?[dailyDataSize];
            result.DHT22hum = new float?[dailyDataSize];
            result.DHT22heat = new float?[dailyDataSize];
            result.BMP280pressure = new float?[dailyDataSize];
            result.BMP280altitude = new float?[dailyDataSize];
            result.BMP280temperature = new float?[dailyDataSize];
            result.ADS1X15MQ135 = new float?[dailyDataSize];
            result.ADS1X15MQ7 = new float?[dailyDataSize];
            result.ADS1X15Light = new float?[dailyDataSize];
            result.CCS811CO2 = new float?[dailyDataSize];
            result.CCS811TVOC = new float?[dailyDataSize];
            result.CCS811resistence = new float?[dailyDataSize];
            result.CCS811temperature = new float?[dailyDataSize];


            int resultIndex = 0;
            for (int i = dailyAirQulitySize - (dayOffset + 1) * 60 * 24; i < dailyAirQulitySize - (dayOffset * 60 * 24); i+=10)
            {
                result.Statuses[resultIndex] = dailyAirQulity[i].Status;
                result.QueryTime[resultIndex] = dailyAirQulity[i].QueryTime;
                result.ClientTime[resultIndex] = dailyAirQulity[i].ClientTime;
                result.TickCount[resultIndex] = dailyAirQulity[i].TickCount;
                result.DHT22[resultIndex] = dailyAirQulity[i].DHT22;
                result.DHT22temp[resultIndex] = dailyAirQulity[i].DHT22temp;
                result.DHT22hum[resultIndex] = dailyAirQulity[i].DHT22hum;
                result.DHT22heat[resultIndex] = dailyAirQulity[i].DHT22heat;
                result.BMP280pressure[resultIndex] = dailyAirQulity[i].BMP280pressure;
                result.BMP280altitude[resultIndex] = dailyAirQulity[i].BMP280altitude;
                result.BMP280temperature[resultIndex] = dailyAirQulity[i].BMP280temperature;
                result.ADS1X15MQ135[resultIndex] = dailyAirQulity[i].ADS1X15MQ135;
                result.ADS1X15MQ7[resultIndex] = dailyAirQulity[i].ADS1X15MQ7;
                result.ADS1X15Light[resultIndex] = dailyAirQulity[i].ADS1X15Light;
                result.CCS811CO2[resultIndex] = dailyAirQulity[i].CCS811CO2;
                result.CCS811TVOC[resultIndex] = dailyAirQulity[i].CCS811TVOC;
                result.CCS811resistence[resultIndex] = dailyAirQulity[i].CCS811resistence;
                result.CCS811temperature[resultIndex] = dailyAirQulity[i].CCS811temp;
                resultIndex++;
            }

            return result;
        }

        //AIR QUALITY DATA ---
        protected void JoinACData(int ACIndex, ThingAirQuality thingAirQuality)
        {
            if ((ACIndex < 0) || (ACIndex >= dailyAirQulitySize))
            {
                return;
            }

            if (dailyAirQulity[ACIndex] == null)
            {
                dailyAirQulity[ACIndex] = thingAirQuality;
            }
            else
            {
                dailyAirQulity[ACIndex].QueryTime = thingAirQuality.QueryTime;
                dailyAirQulity[ACIndex].Status = thingAirQuality.Status;
                dailyAirQulity[ACIndex].TickCount = thingAirQuality.TickCount;

                dailyAirQulity[ACIndex].DHT22 = thingAirQuality.DHT22;

                //если появились новые данные в этом минутном интервале
                if (thingAirQuality.DHT22temp != null)
                {
                    //если данных небыло 
                    if (dailyAirQulity[ACIndex].DHT22temp == null)
                    {
                        //считаем что показания были равны нулю
                        dailyAirQulity[ACIndex].DHT22temp = 0.0f;
                    }
                    //вычисляем среднее значение между запоненым значением и новым значением
                    dailyAirQulity[ACIndex].DHT22temp = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22temp + thingAirQuality.DHT22temp) * 100.0f / 2.0f, MidpointRounding.ToEven) / 100.0f;
                }

                if (thingAirQuality.DHT22hum != null)
                {
                    if (dailyAirQulity[ACIndex].DHT22hum == null)
                    {
                        dailyAirQulity[ACIndex].DHT22hum = 0;
                    }
                    dailyAirQulity[ACIndex].DHT22hum = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22hum + thingAirQuality.DHT22hum) * 100.0f / 2.0f, MidpointRounding.ToEven) / 100.0f;
                }

                if (thingAirQuality.DHT22heat != null)
                {
                    if (dailyAirQulity[ACIndex].DHT22heat == null)
                    {
                        dailyAirQulity[ACIndex].DHT22heat = 0;
                    }
                    dailyAirQulity[ACIndex].DHT22heat = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22heat + thingAirQuality.DHT22heat) * 100.0f / 2.0f, MidpointRounding.ToEven) / 100.0f;
                }

                dailyAirQulity[ACIndex].DHT22c = thingAirQuality.DHT22c;

                dailyAirQulity[ACIndex].BMP280 = thingAirQuality.BMP280;

                if (thingAirQuality.BMP280pressure != null)
                {
                    if (dailyAirQulity[ACIndex].BMP280pressure == null)
                    {
                        dailyAirQulity[ACIndex].BMP280pressure = 0;
                    }
                    dailyAirQulity[ACIndex].BMP280pressure = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280pressure + thingAirQuality.BMP280pressure) / 2.0f, MidpointRounding.ToEven);
                }

                if (thingAirQuality.BMP280altitude != null)
                {
                    if (dailyAirQulity[ACIndex].BMP280altitude == null)
                    {
                        dailyAirQulity[ACIndex].BMP280altitude = 0;
                    }
                    dailyAirQulity[ACIndex].BMP280altitude = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280altitude + thingAirQuality.BMP280altitude) * 100.0f / 2.0f, MidpointRounding.ToEven) / 100.0f;
                }

                if (thingAirQuality.BMP280temperature != null)
                {
                    if (dailyAirQulity[ACIndex].BMP280temperature == null)
                    {
                        dailyAirQulity[ACIndex].BMP280temperature = 0;
                    }
                    dailyAirQulity[ACIndex].BMP280temperature = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280temperature + thingAirQuality.BMP280temperature) * 100.0f / 2.0f, MidpointRounding.ToEven)/ 100.0f;
                }

                dailyAirQulity[ACIndex].ADS1X15 = thingAirQuality.ADS1X15;

                if (thingAirQuality.ADS1X15MQ135 != null)
                {
                    if (dailyAirQulity[ACIndex].ADS1X15MQ135 == null)
                    {
                        dailyAirQulity[ACIndex].ADS1X15MQ135 = 0;
                    }
                    dailyAirQulity[ACIndex].ADS1X15MQ135 = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15MQ135 + thingAirQuality.ADS1X15MQ135) / 2.0f, MidpointRounding.ToEven);
                }

                if (thingAirQuality.ADS1X15MQ7 != null)
                {
                    if (dailyAirQulity[ACIndex].ADS1X15MQ7 == null)
                    {
                        dailyAirQulity[ACIndex].ADS1X15MQ7 = 0;
                    }
                    dailyAirQulity[ACIndex].ADS1X15MQ7 = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15MQ7 + thingAirQuality.ADS1X15MQ7) / 2.0f, MidpointRounding.ToEven);
                }

                if (thingAirQuality.ADS1X15Light != null)
                {
                    if (dailyAirQulity[ACIndex].ADS1X15Light == null)
                    {
                        dailyAirQulity[ACIndex].ADS1X15Light = 0;
                    }
                    dailyAirQulity[ACIndex].ADS1X15Light = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15Light + thingAirQuality.ADS1X15Light) / 2.0f, MidpointRounding.ToEven);
                }

                dailyAirQulity[ACIndex].CCS811 = thingAirQuality.CCS811;

                if (thingAirQuality.CCS811CO2 != null)
                {
                    if (dailyAirQulity[ACIndex].CCS811CO2 == null)
                    {
                        dailyAirQulity[ACIndex].CCS811CO2 = 0;
                    }
                    dailyAirQulity[ACIndex].CCS811CO2 = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811CO2 + thingAirQuality.CCS811CO2) / 2.0f, MidpointRounding.ToEven);
                }

                if (thingAirQuality.CCS811TVOC != null)
                {
                    if (dailyAirQulity[ACIndex].CCS811TVOC == null)
                    {
                        dailyAirQulity[ACIndex].CCS811TVOC = 0;
                    }
                    dailyAirQulity[ACIndex].CCS811TVOC = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811TVOC + thingAirQuality.CCS811TVOC) / 2.0f, MidpointRounding.ToEven);
                }

                if (thingAirQuality.CCS811resistence != null)
                {
                    if (dailyAirQulity[ACIndex].CCS811resistence == null)
                    {
                        dailyAirQulity[ACIndex].CCS811resistence = 0;
                    }
                    dailyAirQulity[ACIndex].CCS811resistence = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811resistence + thingAirQuality.CCS811resistence) * 100.0f / 2.0f, MidpointRounding.ToEven) / 100.0f;
                }

                if (thingAirQuality.CCS811temp != null)
                {
                    if (dailyAirQulity[ACIndex].CCS811temp == null)
                    {
                        dailyAirQulity[ACIndex].CCS811temp = 0;
                    }
                    dailyAirQulity[ACIndex].CCS811temp = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811temp + thingAirQuality.CCS811temp) / 2.0f, MidpointRounding.ToEven);
                }
            }
        }

    protected DateTime RoundDateTimeToOneMinute(DateTime dateTime)
        {
            return new DateTime((dateTime.Ticks + TimeSpan.FromMinutes(1).Ticks - 1) / TimeSpan.FromMinutes(1).Ticks * TimeSpan.FromMinutes(1).Ticks, dateTime.Kind).AddMinutes(-1);
        }

    protected void StoreDailyAirQualityData(List<ThingAirQuality> thingAirQualitys)
        {
            //DateTime currentDate = DateTime.Now;
            DateTime currentDate = (DateTime)thingAirQualitys[thingAirQualitys.Count - 1].QueryTime;

            currentDate = RoundDateTimeToOneMinute(currentDate);

            //thingAirQualitys[thingAirQualitys.Count - 1].QueryTime = currentDate;
            // int timeCorrection = (int)currentDate.Subtract((DateTime)thingAirQualitys[thingAirQualitys.Count - 1].QueryTime).TotalSeconds;
            int timeCorrection = 0;
            

            foreach (ThingAirQuality currentAC in thingAirQualitys)
            {
                currentAC.QueryTime = RoundDateTimeToOneMinute((DateTime)currentAC.QueryTime);

                int ACTime = (int)currentDate.Subtract((DateTime)currentAC.QueryTime).TotalSeconds + timeCorrection;

                int ACIndex = dailyAirQulitySize - (ACTime / 60);

                if (ACIndex > dailyAirQulitySize - 1)
                {
                    ACIndex = dailyAirQulitySize - 1;
                }

                //if (ACIndex == dailyAirQulitySize - 1)
                //{
                //DEBUG
                //  JoinACData(ACIndex, currentAC);
                //}
                dailyAirQulity[ACIndex].LockChangedEvent = true;
                JoinACData(ACIndex, currentAC);

                //JoinACData(ACIndex, currentAC);


                //TimeSpan span = currentDate.Subtract((DateTime)storedQueryTime);
                //int offset = dailyAirQulitySize - (int)(span.TotalSeconds / 60) - 1;
                //if ((offset >= 0) && (offset <= dailyAirQulitySize - 1))

            }

            OnACDataReady?.Invoke(this, new EventArgs());

            foreach(ThingAirQuality thingAirQuality in dailyAirQulity)
            {
                thingAirQuality.LockChangedEvent = false;
            }


            /*
            int lastDayIndex = thingAirQuality.Count - 1;
            DateTime currentDate = DateTime.Now;

            //is minutes counter - last date (minute) at and of array
            int minutesCount = 0;

            int i;
            for (i = dailyAirQulitySize - 1; i > -1; i--)
            {

                dailyAirQulity[i] = new ThingAirQuality()
                {
                    Status = ThingAirQualityStatus.ServerError
                };


                if (lastDayIndex >= 0)
                {
                    if (thingAirQuality[lastDayIndex].QueryTime != null)
                    {
                        DateTime selectedACCDateTime = (DateTime)thingAirQuality[lastDayIndex].QueryTime;
                        if ((selectedACCDateTime < currentDate.AddMinutes(-minutesCount)) && (selectedACCDateTime > currentDate.AddMinutes(-(minutesCount + 1))))
                        {
                            if (lastDayIndex > 0)
                            {
                                while ((selectedACCDateTime < currentDate.AddMinutes(-minutesCount)) && (selectedACCDateTime > currentDate.AddMinutes(-(minutesCount + 1))))
                                {
                                    lastDayIndex--;
                                    if (lastDayIndex == 0)
                                    {
                                        break;
                                    }
                                    selectedACCDateTime = (DateTime)thingAirQuality[lastDayIndex].QueryTime;
                                }
                            }
                            dailyAirQulity[i] = thingAirQuality[lastDayIndex];
                        }
                    }
                }
                dailyAirQulity[i].ClientTime = currentDate.AddMinutes(-minutesCount);
                minutesCount++;

            }
            */
        }

        protected void StoreCurrentAirQualityData(ThingAirQuality thingAirQuality)
        {
            return;

            ThingAirQuality[] newDailyAirQulity = new ThingAirQuality[dailyAirQulitySize];

            DateTime currentDate = DateTime.Now;

            /*
            if (thingAirQuality.QueryTime != null)
            {
                currentDate = (DateTime)thingAirQuality.QueryTime;
            }
            */

            newDailyAirQulity[dailyAirQulitySize - 1] = thingAirQuality;
            newDailyAirQulity[dailyAirQulitySize - 1].ClientTime = DateTime.Now;

            for (int i = dailyAirQulitySize - 1; i > -1; i--)
            {
                if (dailyAirQulity[i] == null)
                {
                    continue;
                }

                DateTime? storedQueryTime = null;
                if (dailyAirQulity[i].ClientTime != null)
                {
                    storedQueryTime = (DateTime)dailyAirQulity[i].ClientTime;
                }

                if (storedQueryTime != null)
                {
                    //calculate index for time between current AC data and stored AC data 
                    TimeSpan span = currentDate.Subtract((DateTime)storedQueryTime);
                    int offset = dailyAirQulitySize - (int)(span.TotalSeconds / 60)-1;
                    if ((offset >= 0) && (offset <= dailyAirQulitySize - 1))
                    {
                        if (newDailyAirQulity[offset] == null)
                        {
                            newDailyAirQulity[offset] = dailyAirQulity[i];
                        }
                        else
                        {
                            newDailyAirQulity[offset].DHT22temp = (newDailyAirQulity[offset].DHT22temp + dailyAirQulity[offset].DHT22temp) / 2.0f;
                        }
                    }
                }
            }

            for (int i = dailyAirQulitySize - 1; i > -1; i--)
            {
                if (newDailyAirQulity[i] == null)
                {
                    newDailyAirQulity[i] = new ThingAirQuality()
                    {
                        ClientTime = DateTime.Now,
                        Status = ThingAirQualityStatus.ServerNotConnected
                    };
                }
            }


            /*
            for (int i = dailyAirQulitySize - 2; i > -1; i--)
            {

                newDailyAirQulity[i] = new ThingAirQuality()
                {
                    ClientTime = currentDate.AddMinutes(-minutesCount),
                    Status = ThingAirQualityStatus.ServerNotConnected
                };

                if (lastDayIndex >= 0)
                {
                    if (dailyAirQulity[lastDayIndex].QueryTime != null)
                    {
                        DateTime selectedACCDateTime = (DateTime)dailyAirQulity[lastDayIndex].QueryTime;
                        if ((selectedACCDateTime < currentDate.AddMinutes(-minutesCount)) && (selectedACCDateTime > currentDate.AddMinutes(-(minutesCount + 1))))
                        {
                            ThingAirQuality lastFound = dailyAirQulity[lastDayIndex];
                            if (lastDayIndex > 0)
                            {
                                while ((selectedACCDateTime < currentDate.AddMinutes(-minutesCount)) && (selectedACCDateTime > currentDate.AddMinutes(-(minutesCount + 1))))
                                {
                                    lastFound = dailyAirQulity[lastDayIndex];
                                    lastDayIndex--;
                                    if (lastDayIndex == 0)
                                    {
                                        break;
                                    }
                                    if (dailyAirQulity[lastDayIndex].QueryTime != null)
                                    {
                                        selectedACCDateTime = (DateTime)dailyAirQulity[lastDayIndex].QueryTime;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                            }
                            newDailyAirQulity[i] = lastFound;
                        }
                    }
                    lastDayIndex--;
                }
                minutesCount++;
            }
            */

            dailyAirQulity = newDailyAirQulity;

        }

        //--- AIR QUALITY DATA

        private void EcosystemServiceClient_OnLogItem(object sender, OWLOSThingsManager.Ecosystem.OWLOS.LogItem e)
        {
            switch (e.networkStatus)
            {
                case NetworkStatus.Online:
                    Log(new OWLOSLogEventArgs("REST client: " + e.text + " " + e.size, ConsoleMessageCode.Success));
                    break;
                case NetworkStatus.Offline:
                    Log(new OWLOSLogEventArgs("REST client: " + e.text, ConsoleMessageCode.Warning));
                    break;
                case NetworkStatus.Reconnect:
                    Log(new OWLOSLogEventArgs("REST client: " + e.text + " " + e.size, ConsoleMessageCode.Info));
                    break;
                default:
                    Log(new OWLOSLogEventArgs("REST client: " + e.text, ConsoleMessageCode.Danger));
                    break;
            }
        }



        //Events ---
        protected virtual void Log(OWLOSLogEventArgs e)
        {
            OnLog?.Invoke(this, e);
        }


        //--- ENDOF Events 


    }
}
