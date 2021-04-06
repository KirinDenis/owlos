using Newtonsoft.Json;
using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.IO.Ports;


namespace OWLOSAdmin.Ecosystem
{
    public class OWLOSThingWrapper
    {
        public Admin CurrentAdmin;
        public OWLOSThingWrapper(Admin CurrentAdmin)
        {
            this.CurrentAdmin = CurrentAdmin;
        }
        public OWLOSTransportOLD transport;
        public OWLOSThing Thing = null;
        public string RESTfulServerHost = string.Empty;
        public Point explorerPosition;
    }

    public class OWLOSThingWrapperEventArgs : EventArgs
    {
        public OWLOSThingWrapper ThingWrapper;
        public OWLOSThingWrapperEventArgs(OWLOSThingWrapper ThingWrapper)
        {
            this.ThingWrapper = ThingWrapper;
        }
    }

    public class AdminConfig
    {
        public List<OWLOSThingConfig> ThingsConfig = new List<OWLOSThingConfig>();
    }
    public class Admin
    {

        public List<OWLOSThingWrapper> OWLOSThingWrappers = new List<OWLOSThingWrapper>();

        public delegate void NewThingEventHandler(object? sender, OWLOSThingWrapperEventArgs e);
        public event NewThingEventHandler OnNewThing;

        public AdminConfig config = new AdminConfig();

        public Admin()
        {
        }

        public void Load()
        {
            if (File.Exists("config.json"))
            {
                string JSONConfig = File.ReadAllText("config.json");
                config = JsonConvert.DeserializeObject<AdminConfig>(JSONConfig);
            }
            else //reset config
            {
                OWLOSThingConfig _OWLOSThingConfig = new OWLOSThingConfig
                {
                    Name = "OWLOS Thing"
                };

                OWLOSConnection _RESTfulClientConnection = new OWLOSConnection
                {
                    connectionType = ConnectionType.RESTfulClient,
                    name = "rest"
                };

                RESTfulClientConnectionDTO _RESTfulClientConnectionDTO = new RESTfulClientConnectionDTO
                {
                    host = "http://192.168.1.101:80/"
                };
                // _RESTfulClientConnectionDTO.port = 80;
                _RESTfulClientConnection.connectionString = JsonConvert.SerializeObject(_RESTfulClientConnectionDTO);

                _OWLOSThingConfig.connections.Add(_RESTfulClientConnection);

                /*

                _RESTfulClientConnection = new OWLOSConnection();
                _RESTfulClientConnection.connectionType = ConnectionType.UART;
                _RESTfulClientConnection.name = "UART";
                _RESTfulClientConnection.host = "COM7";
                _OWLOSThingConfig.connections.Add(_RESTfulClientConnection);

                config.ThingsConfig.Add(_OWLOSThingConfig);
                */


                OWLOSConnection _UARTClientConnection = new OWLOSConnection();
                _UARTClientConnection = new OWLOSConnection
                {
                    connectionType = ConnectionType.UART,
                    name = "UART"
                };
                UARTClientConnectionDTO _UARTClientConnectionDTO = new UARTClientConnectionDTO
                {
                    port = "COM7",
                    baudRate = 115200,
                    parity = Parity.None,
                    stopBits = StopBits.One,
                    dataBits = 8,
                    handshake = Handshake.None,
                    RTSEnable = false
                };
                _UARTClientConnection.connectionString = JsonConvert.SerializeObject(_UARTClientConnectionDTO);

                _OWLOSThingConfig.connections.Add(_UARTClientConnection);

                _OWLOSThingConfig.APIQueryIntervals = new List<APIQueryInterval>() {
            new APIQueryInterval()
            {
                APIType = APINameType.GetAllDriverProperties,
                Interval = 1
            },
            new APIQueryInterval()
            {
                APIType = APINameType.GetAllFiles,
                Interval = 10
            },
            new APIQueryInterval()
            {
                APIType = APINameType.GetAllScripts,
                Interval = 20
            }
            };

                config.ThingsConfig.Add(_OWLOSThingConfig);

            }
            //Save each time before development - add new fields to JSON
            Save();
            foreach (OWLOSThingConfig _OWLOSThingConfig in config.ThingsConfig)
            {
                OWLOSThingWrapper ThingWrapper = new OWLOSThingWrapper(this)
                {
                    Thing = new OWLOSThing(_OWLOSThingConfig)
                };
                OWLOSThingWrappers.Add(ThingWrapper);
                NewThing(new OWLOSThingWrapperEventArgs(ThingWrapper));
            }
        }

        public void Save()
        {
            string JSONConfig = JsonConvert.SerializeObject(config, Formatting.Indented);
            File.WriteAllText("config.json", JSONConfig);
        }

        protected virtual void NewThing(OWLOSThingWrapperEventArgs e)
        {
            OnNewThing?.Invoke(this, e);
        }

    }
}
