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
