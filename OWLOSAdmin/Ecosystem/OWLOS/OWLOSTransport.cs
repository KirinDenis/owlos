using OWLOSAdmin.Ecosystem.OWLOSDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public enum NetworkStatus
    {
        Offline = 0,
        Online,
        Reconnect,
        Erorr
    }



    public class OWLOSTransport : IOWLOSTransport
    {
        public NetworkStatus networkStatus = NetworkStatus.Offline;

        virtual public OWLOSConnection connection { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        virtual public Task<DriversDTO> GetAllDriversProperties()
        {
            throw new NotImplementedException();
        }

        virtual public DriversDTO GetAllDriversProperties(string data)
        {
            DriversDTO driversDTO = new DriversDTO();
            List<string> driverRaw = data.Split('\n').ToList();
            DriverDTO driver = null;

            foreach (string driverProp in driverRaw)
            {
                //find driver
                if (driverProp.IndexOf("properties for:") != -1)
                {
                    driver = new DriverDTO
                    {
                        name = driverProp.Substring(driverProp.IndexOf(":") + 1)
                    };

                    driversDTO.drivers.Add(driver);
                }
                else
                if (driver != null)
                {
                    if (driverProp.IndexOf("=") != -1)
                    {
                        DriverPropertyDTO driverProperty = new DriverPropertyDTO
                        {
                            name = driverProp.Substring(0, driverProp.IndexOf("="))
                        };
                        string _value = driverProp.Substring(driverProp.IndexOf("=") + 1);
                        //await driver.SetParsedProperty(key, value);

                        driverProperty.value = _value.Substring(0, _value.IndexOf("//"));
                        //string _flags = value.Substring(value.IndexOf("//") + 2);
                        //TODO: flags prop type
                        //driverProperty.propType

                        driver.properties.Add(driverProperty);


                        //OWLOSDriverProperty property = properties.Find(p => p.name == name);
                        /*
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
                        */

                    }
                }
            }
            driversDTO.error = string.Empty;
            return driversDTO;
        }
    }
}
