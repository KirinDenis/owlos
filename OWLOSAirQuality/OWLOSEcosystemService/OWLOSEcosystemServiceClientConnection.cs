using OWLOSEcosystemService.DTO.Things;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Security;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace OWLOSAirQuality.OWLOSEcosystemService
{

    public class AirQualityClientResulDTO
    {
        public object result = null;
        public string error = "wrong client initialization";
    }

    public partial class OWLOSEcosystemServiceClient
    {
        public long totlaSend = 0;
        public long totlaRecv = 0;
        public bool enabled = true;
        public NetworkStatus networkStatus;


        public event IOWLOSTransport.TransportEventHandler OnTransportStatusChanger;

        public event IOWLOSTransport.LogEventHandler OnLogItem;

        public async Task<AirQualityClientResulDTO> GetLastThingAQ(string thingHost, string thingToken)
        {
            //ThingAirQualityDTO
            return await Get(thingHost, "GetLastThingAQ", "?token=" + thingToken);                        
        }

        public async Task<AirQualityClientResulDTO> GetLastHourThingAQ(string thingHost, string thingToken)
        {
            //ThingAirQualityDTO
            return await Get(thingHost, "GetLastHourThingAQ", "?token=" + thingToken);
        }

        public async Task<AirQualityClientResulDTO> GetLastDayThingAQ(string thingHost, string thingToken)
        {
            //ThingAirQualityDTO
            return await Get(thingHost, "GetLastDayThingAQ", "?token=" + thingToken);
        }


        private static bool ServerCertificateCustomValidation(HttpRequestMessage requestMessage, X509Certificate2 certificate, X509Chain chain, SslPolicyErrors sslErrors)
        {
            // It is possible inpect the certificate provided by server
         //   Console.WriteLine($"Requested URI: {requestMessage.RequestUri}");
         //   Console.WriteLine($"Effective date: {certificate.GetEffectiveDateString()}");
         //   Console.WriteLine($"Exp date: {certificate.GetExpirationDateString()}");
        //    Console.WriteLine($"Issuer: {certificate.Issuer}");
        //
            // Based on the custom logic it is possible to decide whether the client considers certificate valid or not
       //     Console.WriteLine($"Errors: {sslErrors}");
            return true; // sslErrors == SslPolicyErrors.None;
        }
        protected async Task<AirQualityClientResulDTO> Get(string thingHost, string APIName, string args = "")
        {
            AirQualityClientResulDTO result = new AirQualityClientResulDTO();
            if (!enabled)
            {
                networkStatus = NetworkStatus.Offline;
                result.error = "RESTful disable";
                return result;
            }

            networkStatus = NetworkStatus.Reconnect;

            if (string.IsNullOrEmpty(thingHost))
            {
                networkStatus = NetworkStatus.Offline;
                return result;
            }

            try
            {

                // Create an HttpClientHandler object and set to use default credentials
                HttpClientHandler handler = new HttpClientHandler();

                // Set custom server validation callback
                handler.ServerCertificateCustomValidationCallback = ServerCertificateCustomValidation;
                

                HttpClient client = new HttpClient(handler);

                string queryString = thingHost + APIName + args;

                totlaSend += queryString.Length;
                
                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = true,
                    networkStatus = NetworkStatus.Reconnect,
                    size = queryString.Length,
                    text = thingHost
                });
                

                HttpResponseMessage response = await client.GetAsync(queryString);

                response.EnsureSuccessStatusCode();
                result.result = await response.Content.ReadAsStringAsync();


                totlaRecv += result.result.ToString().Length;
                               
                result.error = string.Empty;
                networkStatus = NetworkStatus.Online;

                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = false,
                    networkStatus = NetworkStatus.Online,
                    size = result.result.ToString().Length,
                    text = thingHost
                });

            }
            catch (Exception exception)
            {
                networkStatus = NetworkStatus.Erorr;
                result.error = exception.Message;

                
                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = true,
                    networkStatus = NetworkStatus.Erorr,
                    size = 0,
                    text = thingHost + " " + exception.Message

                });
                
            }
            return result;
        }

        protected void AddToLog(LogItem logItem)
        {         
            OnLogItem?.Invoke(this, logItem);
        }


    }
}
