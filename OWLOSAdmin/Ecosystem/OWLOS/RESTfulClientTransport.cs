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

    public class RESTfulClientTransport : IOWLOSTransport
    {
        protected RESTfulClientConnection _connection = null;
        public IOWLOSConnection connection { get => _connection; set { _connection = value as RESTfulClientConnection; } }

        public async Task<DriversDTO> GetAllDriversProperties()
        {
            DriversDTO driversDTO = new DriversDTO();

            RESTfulClientResultModel getResult = await Get("getalldriversproperties");
            if (string.IsNullOrEmpty(getResult.error))
            {

                List<string> driverRaw = getResult.result.Split('\n').ToList();
                DriverDTO driver = null;

                foreach (string driverProp in driverRaw)
                {
                    //find driver
                    if (driverProp.IndexOf("properties for:") != -1)
                    {
                        driver = new DriverDTO();

                        driver.name = driverProp.Substring(driverProp.IndexOf(":") + 1);

                        driversDTO.drivers.Add(driver);
                    }
                    else
                    if (driver != null)
                    {
                        if (driverProp.IndexOf("=") != -1)
                        {
                            driver.name = driverProp.Substring(0, driverProp.IndexOf("="));
                            driver.alue = driverProp.Substring(driverProp.IndexOf("=") + 1);
                            await driver.SetParsedProperty(key, value);

                            string _value = value.Substring(0, value.IndexOf("//"));
                            string _flags = value.Substring(value.IndexOf("//") + 2);

                            OWLOSDriverProperty property = properties.Find(p => p.name == name);

                            if (property == null)
                            {
                                property = new OWLOSDriverProperty(this, name, value, _flags);
                                properties.Add(property);
                                PropertyCreate(new OWLOSPropertyWrapperEventArgs(property));
                            }
                            else
                            {
                                property.SetOutside(_value);
                            }


                        }
                    }
                }

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

            if ((_connection == null) || (string.IsNullOrEmpty(_connection.host)))
            {
                return result;
            }    

            try
            {
                HttpClient client = new HttpClient();
                HttpResponseMessage response = await client.GetAsync(_connection.host + APIName + args);

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
