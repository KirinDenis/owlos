using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOSNode
{
    public enum NetworkStatus
    {
        offline = 0,
        online,
        reconnect,
        erorr
    }

    public class TransportType
    {
        public const int HttpClient = 0x0001;
        public const int MQTTClient = 0x0002;
        public const int UART = 0x0004;
    }

    public class OWLOSBaseTransport
    {
        public bool enabled = false;

        public NetworkStatus networkStatus = NetworkStatus.offline;

        public string hostEndPoint = string.Empty;

        public string topic = string.Empty;

        public string login = string.Empty;

        public string password = string.Empty;
        public async Task<string> Get(string topic)
        {
            return string.Empty;
        }

        public async Task<string> Set(string topic, string value)
        {
            return string.Empty; 
        }
    }

    public class OWLOSHTTPTransport: OWLOSBaseTransport
    {

        

        private async Task<string> HTTPGet(string APIName, string args = "")
        {
            try
            {
                HttpClient client = new HttpClient();
                HttpResponseMessage response = await client.GetAsync(hostEndPoint + APIName + args);

                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception exception)
            {
                return "Error:" + exception.Message;
            }


        }


    }

    public class OWLOSTransport
    {
        public string RESTfulServerHost = "http://192.168.1.5/";
        public int RESTfulServerPort = 80;

        public async Task<string> HTTPGet(string APIName, string args = "")
        {
            try
            {
                HttpClient client = new HttpClient();                
                HttpResponseMessage response = await client.GetAsync(RESTfulServerHost + APIName + args);

                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception exception)
            {
                return "Error:" + exception.Message;
            }
            

        }
    }
}
