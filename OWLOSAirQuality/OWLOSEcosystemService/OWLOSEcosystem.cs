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

            if ((ecosystemServiceClient.networkStatus != NetworkStatus.Online) && (ecosystemServiceClient.networkStatus != NetworkStatus.Reconnect))
            {
                AirQualityClientResulDTO airQualityClientResulDTO = await ecosystemServiceClient.GetLastDayThingAQ(thingHost, thingToken);
                if ((string.IsNullOrEmpty(airQualityClientResulDTO.error)) && (airQualityClientResulDTO.result != null))
                {
                    List<ThingAirQualityDTO> thingAirQualityDTO = JsonConvert.DeserializeObject<List<ThingAirQualityDTO>>(airQualityClientResulDTO.result as string);
                    StoreDailyAirQualityData(thingAirQualityDTO);
                    //console.AddToconsole(JsonConvert.SerializeObject(thingAirQualityDTO), 4);
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

            lifeCycleBlocked = false;
        }


        //AIR QUALITY DATA ---

        protected void StoreDailyAirQualityData(List<ThingAirQualityDTO> thingAirQualityDTO)
        {
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
        }

        protected void StoreCurrentAirQualityData(ThingAirQualityDTO thingAirQualityDTO)
        {
            ThingAirQualityDTO[] newDailyAirQulity = new ThingAirQualityDTO[dailyAirQulitySize];

            DateTime currentDate = DateTime.Now;
            if (thingAirQualityDTO.QueryTime != null)
            {
                currentDate = (DateTime)thingAirQualityDTO.QueryTime;
            }
            
            newDailyAirQulity[dailyAirQulitySize - 1] = thingAirQualityDTO;
            newDailyAirQulity[dailyAirQulitySize - 1].ClientTime = DateTime.Now;

            for (int i = dailyAirQulitySize - 1; i > -1; i--)
            {
                if (dailyAirQulity[i] == null)
                {
                    continue;
                }
                DateTime? storedQueryTime= null;
              //  if (dailyAirQulity[i].QueryTime != null)
           //     { 
           //         storedQueryTime = (DateTime)dailyAirQulity[i].QueryTime;
           //      }
           //     else
                {
                    if (dailyAirQulity[i].ClientTime != null)
                    {
                        storedQueryTime = (DateTime)dailyAirQulity[i].ClientTime;
                    }
                }

                if (storedQueryTime != null)
                {
                    //calculate index for time between current AC data and stored AC data 
                    TimeSpan span = currentDate.Subtract((DateTime)storedQueryTime);
                    int offset = dailyAirQulitySize - (int)(span.TotalSeconds / 60);
                    if ((offset >= 0) && (offset < dailyAirQulitySize-1))
                    {
                        newDailyAirQulity[offset] = dailyAirQulity[i];
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
