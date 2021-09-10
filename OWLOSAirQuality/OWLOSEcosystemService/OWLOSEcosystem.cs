using Newtonsoft.Json;
using OWLOSEcosystemService.DTO.Things;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Timers;

namespace OWLOSAirQuality.OWLOSEcosystemService
{
    public class OWLOSEcosystem
    {
        private readonly OWLOSEcosystemClient ecosystemServiceClient;

        public string thingHost = "https://192.168.1.100:5004/Things/";

        public string thingToken = "VVRQUndWTzI4dW5YR1Jxb0IyQVpXUU9oaUdURWNBdmlMTHdpSWtMSUxnSVFBQUFBZHc5VllNalU1Sk0rMGNQano5Q0JKVE5oSm94OFNkNHJyNlhHcXRRRHpDZWU1ck1SV0hWQi9CYXM0dngwL0RPemYxTzZ4NWtjc1dCeGpsV3NTTldNWFlIc3hqWlVyd1MzcDBWbnd6OHhuZzJ1eXc2OCtCMm04SlphN1lOcVUxZ2NVMWVmVXdtL3g1SXFTQ3I2YXdhZERnPT0=";

        public int quaryInterval = 1000;

        protected bool lifeCycleBlocked = false;

        protected Timer lifeCycleTimer;

        protected const int dailyAirQulitySize = 60 * 24;

        public ThingAirQualityDTO[] dailyAirQulity = new ThingAirQualityDTO[dailyAirQulitySize];

        public OWLOSEcosystem()
        {
            ecosystemServiceClient = new OWLOSEcosystemClient();


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

            AirQualityClientResulDTO airQualityClientResulDTO = await ecosystemServiceClient.GetLastDayThingAQ(thingHost, thingToken);
            if ((string.IsNullOrEmpty(airQualityClientResulDTO.error)) && (airQualityClientResulDTO.result != null))
            {
                List<ThingAirQualityDTO> thingAirQualityDTO = JsonConvert.DeserializeObject<List<ThingAirQualityDTO>>(airQualityClientResulDTO.result as string);
                StoreDailyAirQualityData(thingAirQualityDTO);
            }

/*
            if ((ecosystemServiceClient.networkStatus != NetworkStatus.Online) && (ecosystemServiceClient.networkStatus != NetworkStatus.Reconnect))
            {
                AirQualityClientResulDTO airQualityClientResulDTO = await ecosystemServiceClient.GetLastDayThingAQ(thingHost, thingToken);
                if ((string.IsNullOrEmpty(airQualityClientResulDTO.error)) && (airQualityClientResulDTO.result != null))
                {
                    List<ThingAirQualityDTO> thingAirQualityDTO = JsonConvert.DeserializeObject<List<ThingAirQualityDTO>>(airQualityClientResulDTO.result as string);
                    StoreDailyAirQualityData(thingAirQualityDTO);                    
                }
                else
                {
                    StoreCurrentAirQualityData(new ThingAirQualityDTO()
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
                    ThingAirQualityDTO thingAirQualityDTO = JsonConvert.DeserializeObject<ThingAirQualityDTO>(airQualityClientResulDTO.result as string);
                    StoreCurrentAirQualityData(thingAirQualityDTO);

                }
                else
                {
                    StoreCurrentAirQualityData(new ThingAirQualityDTO()
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
        protected void JoinACData(int ACIndex, ThingAirQualityDTO thingAirQualityDTO)
        {
            if (dailyAirQulity[ACIndex] == null)
            {
                dailyAirQulity[ACIndex] = thingAirQualityDTO;
            }
            else
            {
                dailyAirQulity[ACIndex].QueryTime = thingAirQualityDTO.QueryTime;
                dailyAirQulity[ACIndex].Status = thingAirQualityDTO.Status;
                dailyAirQulity[ACIndex].TickCount = thingAirQualityDTO.TickCount;

                dailyAirQulity[ACIndex].DHT22 = thingAirQualityDTO.DHT22;
                if ((dailyAirQulity[ACIndex].DHT22temp != null) && (thingAirQualityDTO.DHT22temp != null))
                {
                    dailyAirQulity[ACIndex].DHT22temp = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22temp + thingAirQualityDTO.DHT22temp) * 100.0f / 2.0f, MidpointRounding.ToEven) / 100.0f;
                }

                if ((dailyAirQulity[ACIndex].DHT22hum != null) && (thingAirQualityDTO.DHT22hum != null))
                {
                    dailyAirQulity[ACIndex].DHT22hum = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22hum + thingAirQualityDTO.DHT22hum) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].DHT22heat != null) && (thingAirQualityDTO.DHT22heat != null))
                {
                    dailyAirQulity[ACIndex].DHT22heat = (float)Math.Round((float)(dailyAirQulity[ACIndex].DHT22heat + thingAirQualityDTO.DHT22heat) / 2.0f, MidpointRounding.ToEven);
                }

                dailyAirQulity[ACIndex].DHT22c = thingAirQualityDTO.DHT22c;


                dailyAirQulity[ACIndex].BMP280 = thingAirQualityDTO.BMP280;

                if ((dailyAirQulity[ACIndex].BMP280pressure != null) && (thingAirQualityDTO.BMP280pressure != null))
                {
                    dailyAirQulity[ACIndex].BMP280pressure = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280pressure + thingAirQualityDTO.BMP280pressure) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].BMP280altitude != null) && (thingAirQualityDTO.BMP280altitude != null))
                {
                    dailyAirQulity[ACIndex].BMP280altitude = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280altitude + thingAirQualityDTO.BMP280altitude) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].BMP280temperature != null) && (thingAirQualityDTO.BMP280temperature != null))
                {
                    dailyAirQulity[ACIndex].BMP280temperature = (float)Math.Round((float)(dailyAirQulity[ACIndex].BMP280temperature + thingAirQualityDTO.BMP280temperature) / 2.0f, MidpointRounding.ToEven);
                }

                dailyAirQulity[ACIndex].ADS1X15 = thingAirQualityDTO.ADS1X15;

                if ((dailyAirQulity[ACIndex].ADS1X15MQ135 != null) && (thingAirQualityDTO.ADS1X15MQ135 != null))
                {
                    dailyAirQulity[ACIndex].ADS1X15MQ135 = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15MQ135 + thingAirQualityDTO.ADS1X15MQ135) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].ADS1X15MQ7 != null) && (thingAirQualityDTO.ADS1X15MQ7 != null))
                {
                    dailyAirQulity[ACIndex].ADS1X15MQ7 = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15MQ7 + thingAirQualityDTO.ADS1X15MQ7) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].ADS1X15Light != null) && (thingAirQualityDTO.ADS1X15Light != null))
                {
                    dailyAirQulity[ACIndex].ADS1X15Light = (float)Math.Round((float)(dailyAirQulity[ACIndex].ADS1X15Light + thingAirQualityDTO.ADS1X15Light) / 2.0f, MidpointRounding.ToEven);
                }

                dailyAirQulity[ACIndex].CCS811 = thingAirQualityDTO.CCS811;

                if ((dailyAirQulity[ACIndex].CCS811CO2 != null) && (thingAirQualityDTO.CCS811CO2 != null))
                {
                    dailyAirQulity[ACIndex].CCS811CO2 = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811CO2 + thingAirQualityDTO.CCS811CO2) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].CCS811TVOC != null) && (thingAirQualityDTO.CCS811TVOC != null))
                {
                    dailyAirQulity[ACIndex].CCS811TVOC = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811TVOC + thingAirQualityDTO.CCS811TVOC) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].CCS811resistence != null) && (thingAirQualityDTO.CCS811resistence != null))
                {
                    dailyAirQulity[ACIndex].CCS811resistence = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811resistence + thingAirQualityDTO.CCS811resistence) / 2.0f, MidpointRounding.ToEven);
                }

                if ((dailyAirQulity[ACIndex].CCS811temp != null) && (thingAirQualityDTO.CCS811temp != null))
                {
                    dailyAirQulity[ACIndex].CCS811temp = (float)Math.Round((float)(dailyAirQulity[ACIndex].CCS811temp + thingAirQualityDTO.CCS811temp) / 2.0f, MidpointRounding.ToEven);
                }
            }
        }

    protected DateTime RoundDateTimeToOneMinute(DateTime dateTime)
        {
            return new DateTime((dateTime.Ticks + TimeSpan.FromMinutes(1).Ticks - 1) / TimeSpan.FromMinutes(1).Ticks * TimeSpan.FromMinutes(1).Ticks, dateTime.Kind);
        }

    protected void StoreDailyAirQualityData(List<ThingAirQualityDTO> thingAirQualityDTOs)
        {
            //DateTime currentDate = DateTime.Now;
            DateTime currentDate = (DateTime)thingAirQualityDTOs[thingAirQualityDTOs.Count - 1].QueryTime;

            currentDate = RoundDateTimeToOneMinute(currentDate);

            //thingAirQualityDTOs[thingAirQualityDTOs.Count - 1].QueryTime = currentDate;
            // int timeCorrection = (int)currentDate.Subtract((DateTime)thingAirQualityDTOs[thingAirQualityDTOs.Count - 1].QueryTime).TotalSeconds;
            int timeCorrection = 0;
            

            foreach (ThingAirQualityDTO currentAC in thingAirQualityDTOs)
            {
                currentAC.QueryTime = RoundDateTimeToOneMinute((DateTime)currentAC.QueryTime);

                int ACTime = (int)currentDate.Subtract((DateTime)currentAC.QueryTime).TotalSeconds + timeCorrection;

                int ACIndex = dailyAirQulitySize - (ACTime / 60) - 1;

                

                JoinACData(ACIndex, currentAC);
                
                //TimeSpan span = currentDate.Subtract((DateTime)storedQueryTime);
                //int offset = dailyAirQulitySize - (int)(span.TotalSeconds / 60) - 1;
                //if ((offset >= 0) && (offset <= dailyAirQulitySize - 1))

            }

            /*
            int lastDayIndex = thingAirQualityDTO.Count - 1;
            DateTime currentDate = DateTime.Now;

            //is minutes counter - last date (minute) at and of array
            int minutesCount = 0;

            int i;
            for (i = dailyAirQulitySize - 1; i > -1; i--)
            {

                dailyAirQulity[i] = new ThingAirQualityDTO()
                {
                    Status = ThingAirQualityStatus.ServerError
                };


                if (lastDayIndex >= 0)
                {
                    if (thingAirQualityDTO[lastDayIndex].QueryTime != null)
                    {
                        DateTime selectedACCDateTime = (DateTime)thingAirQualityDTO[lastDayIndex].QueryTime;
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
                                    selectedACCDateTime = (DateTime)thingAirQualityDTO[lastDayIndex].QueryTime;
                                }
                            }
                            dailyAirQulity[i] = thingAirQualityDTO[lastDayIndex];
                        }
                    }
                }
                dailyAirQulity[i].ClientTime = currentDate.AddMinutes(-minutesCount);
                minutesCount++;

            }
            */
        }

        protected void StoreCurrentAirQualityData(ThingAirQualityDTO thingAirQualityDTO)
        {
            return;

            ThingAirQualityDTO[] newDailyAirQulity = new ThingAirQualityDTO[dailyAirQulitySize];

            DateTime currentDate = DateTime.Now;

            /*
            if (thingAirQualityDTO.QueryTime != null)
            {
                currentDate = (DateTime)thingAirQualityDTO.QueryTime;
            }
            */

            newDailyAirQulity[dailyAirQulitySize - 1] = thingAirQualityDTO;
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
                    newDailyAirQulity[i] = new ThingAirQualityDTO()
                    {
                        ClientTime = DateTime.Now,
                        Status = ThingAirQualityStatus.ServerNotConnected
                    };
                }
            }


            /*
            for (int i = dailyAirQulitySize - 2; i > -1; i--)
            {

                newDailyAirQulity[i] = new ThingAirQualityDTO()
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
                            ThingAirQualityDTO lastFound = dailyAirQulity[lastDayIndex];
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


    }
}
