using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public class RESTfulClientResultModel
    {
        public string result = string.Empty;
        public string error = "wrong client initialization";
    }

    public class RESTfulClientConnectionDTO
    {
        public string host;
    }

    public class RESTfulClientTransport : OWLOSTransport
    {
        protected OWLOSConnection _connection = null;

        public RESTfulClientConnectionDTO _RESTfulClientConnectionDTO;
        override public OWLOSConnection connection 
        { 
            get => _connection; 
            set 
            { 
                _connection = value as OWLOSConnection;
                _RESTfulClientConnectionDTO = JsonConvert.DeserializeObject<RESTfulClientConnectionDTO>(_connection.connectionString);
            } 
        }

        private OWLOSNode node = null;

        public RESTfulClientTransport(OWLOSNode node)
        {
            this.node = node;
        }


        override public async Task<bool> GetAllDriversProperties()
        {
            RESTfulClientResultModel getResult = await Get("getalldriversproperties");
            if (string.IsNullOrEmpty(getResult.error))
            {                
                node.ParseGetAllDriversProperties(getResult.result);
                return true;
            }
            else
            {
                return false;
            }            
        }

        override public async Task<bool> GetAllFiles()
        {
            RESTfulClientResultModel getResult = await Get("getfilelist?path=");
            if (string.IsNullOrEmpty(getResult.error))
            {
                node.files.ParseGetAllFiles(getResult.result);
                return true;
            }
            else
            {
                return false;
            }
        }


        public override async Task<bool> SetDriverProperty(string driver, string property, string value)
        {

            RESTfulClientResultModel getResult = await Get("setdriverproperty?id=" + driver + "&property=" + property + "&value=" + property);
            
            if (string.IsNullOrEmpty(getResult.error))
            {                
                return true;
            }
            else
            {
                return false;
            }

        }

        protected async Task<RESTfulClientResultModel> Get(string APIName, string args = "")
        {

            
            RESTfulClientResultModel result = new RESTfulClientResultModel();
            if (!connection.enable)
            {
                networkStatus = NetworkStatus.Offline;
                result.error = "RESTful disable";
                return result;
            }

            networkStatus = NetworkStatus.Reconnect;

            if ((_connection == null) || (string.IsNullOrEmpty(_RESTfulClientConnectionDTO.host)))
            {
                networkStatus = NetworkStatus.Offline;
                return result;
            }    

            try
            {
                HttpClient client = new HttpClient();
                
                string queryString = _RESTfulClientConnectionDTO.host + APIName + args;

                totlaSend += queryString.Length;
                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = true,
                    networkStatus = NetworkStatus.Reconnect,
                    size = queryString.Length,                    
                    text = queryString
                });



                HttpResponseMessage response = await client.GetAsync(queryString);

                response.EnsureSuccessStatusCode();
                result.result = await response.Content.ReadAsStringAsync();

                totlaRecv += result.result.Length;

                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = false,
                    networkStatus = NetworkStatus.Reconnect,                    
                    size = result.result.Length,
                    text = result.result
                });


                result.error = string.Empty;
                networkStatus = NetworkStatus.Online;
            }
            catch (Exception exception)
            {
                networkStatus = NetworkStatus.Erorr;
                result.error = exception.Message;

                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = true,
                    networkStatus = _networkStatus,
                    size = 0,
                    text = exception.Message

                }); ;

            }

            return result;
        }

    }
}
