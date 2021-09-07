using Newtonsoft.Json;
using OWLOSEcosystemService.DTO.Things;
using System.Timers;

namespace OWLOSAirQuality.OWLOSEcosystemService
{
    public class OWLOSEcosystem
    {
        private readonly OWLOSEcosystemClient ecosystemServiceClient;

        public string thingHost = "https://192.168.1.100:5004/Things/";

        public string thingToken = "VVRQUndWTzI4dW5YR1Jxb0IyQVpXUU9oaUdURWNBdmlMTHdpSWtMSUxnSVFBQUFBZHc5VllNalU1Sk0rMGNQano5Q0JKVE5oSm94OFNkNHJyNlhHcXRRRHpDZWU1ck1SV0hWQi9CYXM0dngwL0RPemYxTzZ4NWtjc1dCeGpsV3NTTldNWFlIc3hqWlVyd1MzcDBWbnd6OHhuZzJ1eXc2OCtCMm04SlphN1lOcVUxZ2NVMWVmVXdtL3g1SXFTQ3I2YXdhZERnPT0=";

        public int quaryInterval = 1000;

        protected Timer lifeCycleTimer;

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

            AirQualityClientResulDTO airQualityClientResulDTO = await ecosystemServiceClient.GetThingAirQuality(thingHost, thingToken);

            if ((string.IsNullOrEmpty(airQualityClientResulDTO.error)) && (airQualityClientResulDTO.result != null))
            {
                ThingAirQualityDTO thingAirQualityDTO = JsonConvert.DeserializeObject<ThingAirQualityDTO>(airQualityClientResulDTO.result as string);
                //console.AddToconsole(JsonConvert.SerializeObject(thingAirQualityDTO), 4);
            }
            else
            {
                //console.AddToconsole(airQualityClientResulDTO.error, 1);
            }

        }
    }
}
