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

        public string thingHost = "https://192.168.1.100:5004/Things/";

        public string thingToken = "VVRQUndWTzI4dW5YR1Jxb0IyQVpXUU9oaUdURWNBdmlMTHdpSWtMSUxnSVFBQUFBZHc5VllNalU1Sk0rMGNQano5Q0JKVE5oSm94OFNkNHJyNlhHcXRRRHpDZWU1ck1SV0hWQi9CYXM0dngwL0RPemYxTzZ4NWtjc1dCeGpsV3NTTldNWFlIc3hqWlVyd1MzcDBWbnd6OHhuZzJ1eXc2OCtCMm04SlphN1lOcVUxZ2NVMWVmVXdtL3g1SXFTQ3I2YXdhZERnPT0=";

        public int quaryInterval = 1000;

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
                if ((dailyAirQulity[ACIndex].DHT22temp != null) && (thingAirQuality.DHT22temp != null))
                {
                    dailyAirQulity[ACIndex].DHT22temp = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22temp + thingAirQuality.DHT22temp) * 100.0f / 2.0f, MidpointRounding.ToEven) / 100.0f;
                }

                if ((dailyAirQulity[ACIndex].DHT22hum != null) && (thingAirQuality.DHT22hum != null))
                {
                    dailyAirQulity[ACIndex].DHT22hum = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22hum + thingAirQuality.DHT22hum) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].DHT22heat != null) && (thingAirQuality.DHT22heat != null))
                {
                    dailyAirQulity[ACIndex].DHT22heat = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22heat + thingAirQuality.DHT22heat) / 2.0f, MidpointRounding.ToEven);
                }

                dailyAirQulity[ACIndex].DHT22c = thingAirQuality.DHT22c;


                dailyAirQulity[ACIndex].BMP280 = thingAirQuality.BMP280;

                if ((dailyAirQulity[ACIndex].BMP280pressure != null) && (thingAirQuality.BMP280pressure != null))
                {
                    dailyAirQulity[ACIndex].BMP280pressure = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280pressure + thingAirQuality.BMP280pressure) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].BMP280altitude != null) && (thingAirQuality.BMP280altitude != null))
                {
                    dailyAirQulity[ACIndex].BMP280altitude = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280altitude + thingAirQuality.BMP280altitude) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].BMP280temperature != null) && (thingAirQuality.BMP280temperature != null))
                {
                    dailyAirQulity[ACIndex].BMP280temperature = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280temperature + thingAirQuality.BMP280temperature) / 2.0f, MidpointRounding.ToEven);
                }

                dailyAirQulity[ACIndex].ADS1X15 = thingAirQuality.ADS1X15;

                if ((dailyAirQulity[ACIndex].ADS1X15MQ135 != null) && (thingAirQuality.ADS1X15MQ135 != null))
                {
                    dailyAirQulity[ACIndex].ADS1X15MQ135 = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15MQ135 + thingAirQuality.ADS1X15MQ135) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].ADS1X15MQ7 != null) && (thingAirQuality.ADS1X15MQ7 != null))
                {
                    dailyAirQulity[ACIndex].ADS1X15MQ7 = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15MQ7 + thingAirQuality.ADS1X15MQ7) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].ADS1X15Light != null) && (thingAirQuality.ADS1X15Light != null))
                {
                    dailyAirQulity[ACIndex].ADS1X15Light = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15Light + thingAirQuality.ADS1X15Light) / 2.0f, MidpointRounding.ToEven);
                }

                dailyAirQulity[ACIndex].CCS811 = thingAirQuality.CCS811;

                if ((dailyAirQulity[ACIndex].CCS811CO2 != null) && (thingAirQuality.CCS811CO2 != null))
                {
                    dailyAirQulity[ACIndex].CCS811CO2 = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811CO2 + thingAirQuality.CCS811CO2) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].CCS811TVOC != null) && (thingAirQuality.CCS811TVOC != null))
                {
                    dailyAirQulity[ACIndex].CCS811TVOC = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811TVOC + thingAirQuality.CCS811TVOC) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].CCS811resistence != null) && (thingAirQuality.CCS811resistence != null))
                {
                    dailyAirQulity[ACIndex].CCS811resistence = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811resistence + thingAirQuality.CCS811resistence) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].CCS811temp != null) && (thingAirQuality.CCS811temp != null))
                {
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

                int ACIndex = dailyAirQulitySize - (ACTime / 60) - 1;

                

                JoinACData(ACIndex, currentAC);
                
                //TimeSpan span = currentDate.Subtract((DateTime)storedQueryTime);
                //int offset = dailyAirQulitySize - (int)(span.TotalSeconds / 60) - 1;
                //if ((offset >= 0) && (offset <= dailyAirQulitySize - 1))

            }

            OnACDataReady?.Invoke(this, new EventArgs());

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
