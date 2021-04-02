using Newtonsoft.Json;
using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.IO.Ports;


namespace OWLOSAdmin.Ecosystem
{
    public class OWLOSNodeWrapper
    {
        public Admin CurrentAdmin;
        public OWLOSNodeWrapper(Admin CurrentAdmin)
        {
            this.CurrentAdmin = CurrentAdmin;
        }
        public OWLOSTransportOLD transport;
        public OWLOSNode node = null;
        public string RESTfulServerHost = string.Empty;
        public Point explorerPosition;
    }

    public class OWLOSNodeWrapperEventArgs : EventArgs
    {
        public OWLOSNodeWrapper nodeWrapper;
        public OWLOSNodeWrapperEventArgs(OWLOSNodeWrapper nodeWrapper)
        {
            this.nodeWrapper = nodeWrapper;
        }
    }

    public class AdminConfig
    {
        public List<OWLOSNodeConfig> nodesConfig = new List<OWLOSNodeConfig>();
    }
    public class Admin
    {

        public List<OWLOSNodeWrapper> OWLOSNodeWrappers = new List<OWLOSNodeWrapper>();

        public delegate void NewNodeEventHandler(object? sender, OWLOSNodeWrapperEventArgs e);
        public event NewNodeEventHandler OnNewNode;

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
                OWLOSNodeConfig _OWLOSNodeConfig = new OWLOSNodeConfig
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

                _OWLOSNodeConfig.connections.Add(_RESTfulClientConnection);

                /*

                _RESTfulClientConnection = new OWLOSConnection();
                _RESTfulClientConnection.connectionType = ConnectionType.UART;
                _RESTfulClientConnection.name = "UART";
                _RESTfulClientConnection.host = "COM7";
                _OWLOSNodeConfig.connections.Add(_RESTfulClientConnection);

                config.nodesConfig.Add(_OWLOSNodeConfig);
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

                _OWLOSNodeConfig.connections.Add(_UARTClientConnection);

                _OWLOSNodeConfig.APIQueryIntervals = new List<APIQueryInterval>() {
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

                config.nodesConfig.Add(_OWLOSNodeConfig);

            }
            //Save each time before development - add new fields to JSON
            Save();
            foreach (OWLOSNodeConfig _OWLOSNodeConfig in config.nodesConfig)
            {
                OWLOSNodeWrapper nodeWrapper = new OWLOSNodeWrapper(this)
                {
                    node = new OWLOSNode(_OWLOSNodeConfig)
                };
                OWLOSNodeWrappers.Add(nodeWrapper);
                NewNode(new OWLOSNodeWrapperEventArgs(nodeWrapper));
            }
        }

        public void Save()
        {
            string JSONConfig = JsonConvert.SerializeObject(config, Formatting.Indented);
            File.WriteAllText("config.json", JSONConfig);
        }

        protected virtual void NewNode(OWLOSNodeWrapperEventArgs e)
        {
            OnNewNode?.Invoke(this, e);
        }

    }
}
