using Newtonsoft.Json;
using OWLOSAdmin.Ecosystem.OWLOSDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
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
        public uint port;
    }

    public class RESTfulClientTransport : OWLOSTransport
    {
        protected OWLOSConnection _connection = null;

        protected RESTfulClientConnectionDTO _RESTfulClientConnectionDTO;
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

        override public async Task<DriversDTO> GetAllDriversProperties()
        {
            DriversDTO driversDTO = new DriversDTO();

            RESTfulClientResultModel getResult = await Get("getalldriversproperties");
            if (string.IsNullOrEmpty(getResult.error))
            {
                //driversDTO = base.GetAllDriversProperties(getResult.result);
                node.parseDrivers(getResult.result);
            }
            else
            {
                driversDTO.error = getResult.error;
            }

            return driversDTO;
        }

        protected async Task<RESTfulClientResultModel> Get(string APIName, string args = "")
        {
            RESTfulClientResultModel result = new RESTfulClientResultModel();

            if ((_connection == null) || (string.IsNullOrEmpty(_RESTfulClientConnectionDTO.host)))
            {
                return result;
            }    

            try
            {
                HttpClient client = new HttpClient();                
                HttpResponseMessage response = await client.GetAsync(_RESTfulClientConnectionDTO.host + APIName + args);

                response.EnsureSuccessStatusCode();
                result.result = await response.Content.ReadAsStringAsync();
                result.error = string.Empty;                
            }
            catch (Exception exception)
            {
                result.error = exception.Message;
            }

            return result;
        }

    }
}
