using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Timers;

namespace OWLOSAdmin.Ecosystem.OWLOS
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

    public class OWLOSTransportOLD
    {
        private readonly OWLOSNode node = null;
        public string RESTfulServerHost = "";
        public int RESTfulServerPort = 80;
        private Timer lifeCycleTimer;


        public OWLOSTransportOLD(OWLOSNode node)
        {
            this.node = node;
        }
        public void Start()
        {
            lifeCycleTimer = new Timer(1000)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();
            OnLifeCycleTimer(null, null);

        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            await GetAllDriversProperties();
            await GetAllScripts();
        }

        public async Task<string> Get(string APIName, string args = "")
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

        
        public async Task<bool> GetAllScripts()
        {
            string driverPoperties = await Get("getallscripts");
            if (driverPoperties.IndexOf("Error:") != 0)
            {
                try
                {
                    await node.parseDrivers(driverPoperties);
                    return true;
                }
                catch { }
            }
            return false;
        }


        public async Task<bool> GetAllDriversProperties()
        {
            string driverPoperties = await Get("getalldriversproperties");
            if (driverPoperties.IndexOf("Error:") != 0)
            {
                try
                {
                    await node.parseDrivers(driverPoperties);
                    return true;
                }
                catch { }
            }
            return false;
        }

        public async Task<string> GetDriverProperty(string driverName, string propertyName)
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(RESTfulServerHost + "getdriverproperty?id=" + driverName + "&property=" + propertyName);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> SetDriverProperty(string driverName, string propertyName, string propertyValue)
        {
            try
            {
                HttpClient client = new HttpClient();
                HttpResponseMessage response = await client.GetAsync(RESTfulServerHost + "setdriverproperty?id=" + driverName + "&property=" + propertyName + "&value=" + propertyValue);
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
