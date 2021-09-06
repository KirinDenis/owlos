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

    public class OWLOSEcosystemClient
    {
        public long totlaSend = 0;
        public long totlaRecv = 0;
        public bool enabled = true;
        public NetworkStatus networkStatus;
        protected string host = "https://192.168.1.100:5004/Things/";


        public async Task<AirQualityClientResulDTO> GetThingAirQuality(string token)
        {
            //ThingAirQualityDTO
            return await Get("GetAirQuality", "?token=" + token);
                        
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
        protected async Task<AirQualityClientResulDTO> Get(string APIName, string args = "")
        {
            AirQualityClientResulDTO result = new AirQualityClientResulDTO();
            if (!enabled)
            {
                networkStatus = NetworkStatus.Offline;
                result.error = "RESTful disable";
                return result;
            }

            networkStatus = NetworkStatus.Reconnect;

            if (string.IsNullOrEmpty(host))
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

                string queryString = host + APIName + args;

                totlaSend += queryString.Length;
                /*
                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = true,
                    networkStatus = NetworkStatus.Reconnect,
                    size = queryString.Length,
                    text = queryString
                });
                */

                HttpResponseMessage response = await client.GetAsync(queryString);

                response.EnsureSuccessStatusCode();
                result.result = await response.Content.ReadAsStringAsync();

                
                //totlaRecv += result. TODO Size 

                /*
                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = false,
                    networkStatus = NetworkStatus.Reconnect,
                    size = result.result.Length,
                    text = result.result
                });
                */
                result.error = string.Empty;
                networkStatus = NetworkStatus.Online;
            }
            catch (Exception exception)
            {
                networkStatus = NetworkStatus.Erorr;
                result.error = exception.Message;

                /*
                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = true,
                    networkStatus = _networkStatus,
                    size = 0,
                    text = exception.Message

                });
                */
            }
            return result;
        }

    }
}
