using Newtonsoft.Json;
using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.IO.Ports;
using System.Text;


namespace OWLOSAdmin.Ecosystem
{

    
    public class OWLOSNodeWrapper
    {
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
        
        List<OWLOSNodeWrapper> OWLOSNodeWrappers = new List<OWLOSNodeWrapper>();

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
                OWLOSNodeConfig _OWLOSNodeConfig = new OWLOSNodeConfig();
                OWLOSConnection _RESTfulClientConnection = new OWLOSConnection();
                _RESTfulClientConnection.connectionType = ConnectionType.RESTfulClient;
                _RESTfulClientConnection.name = "rest";

                RESTfulClientConnectionDTO _RESTfulClientConnectionDTO = new RESTfulClientConnectionDTO();
                _RESTfulClientConnectionDTO.host = "192.168.1.101";
                _RESTfulClientConnection.connectionString = JsonConvert.SerializeObject(_RESTfulClientConnectionDTO);

                _OWLOSNodeConfig.connections.Add(_RESTfulClientConnection);

                OWLOSConnection _UARTClientConnection = new OWLOSConnection();
                _UARTClientConnection = new OWLOSConnection();
                _UARTClientConnection.connectionType = ConnectionType.UART;
                _UARTClientConnection.name = "UART";
                UARTClientConnectionDTO _UARTClientConnectionDTO = new UARTClientConnectionDTO();
                _UARTClientConnectionDTO.port = "COM7";
                _UARTClientConnectionDTO.baudRate = 115200;
                _UARTClientConnectionDTO.parity = Parity.None;
                _UARTClientConnectionDTO.stopBits = StopBits.One;
                _UARTClientConnectionDTO.dataBits = 8;
                _UARTClientConnectionDTO.handshake = Handshake.None;
                _UARTClientConnectionDTO.RTSEnable = false;
                _UARTClientConnection.connectionString = JsonConvert.SerializeObject(_UARTClientConnectionDTO);
                
                _OWLOSNodeConfig.connections.Add(_UARTClientConnection);

                config.nodesConfig.Add(_OWLOSNodeConfig);
                Save();
            }

            foreach (OWLOSNodeConfig _OWLOSNodeConfig in config.nodesConfig)
            {
                OWLOSNodeWrapper nodeWrapper = new OWLOSNodeWrapper();
                nodeWrapper.node = new OWLOSNode(this, _OWLOSNodeConfig);
                OWLOSNodeWrappers.Add(nodeWrapper);
                NewNode(new OWLOSNodeWrapperEventArgs(nodeWrapper));

            }


            /*
            OWLOSNodeWrapper nodeWrapper = new OWLOSNodeWrapper();
            //nodeWrapper.RESTfulServerHost = "http://192.168.1.101/";            
            nodeWrapper.node = new OWLOSNode(this);                        
            //nodeWrapper.transport = new OWLOSTransport(nodeWrapper.node);
            //nodeWrapper.transport.RESTfulServerHost = nodeWrapper.RESTfulServerHost;
            //nodeWrapper.transport.Start();
            OWLOSNodeWrappers.Add(nodeWrapper);
            NewNode(new OWLOSNodeWrapperEventArgs(nodeWrapper));
            */
            
            /*
            nodeWrapper = new OWLOSNodeWrapper();
            nodeWrapper.RESTfulServerHost = "http://192.168.1.12/";
            nodeWrapper.node = new OWLOSNode(this, nodeWrapper);
            nodeWrapper.transport = new OWLOSTransport(nodeWrapper.node);
            nodeWrapper.transport.RESTfulServerHost = nodeWrapper.RESTfulServerHost;
            nodeWrapper.transport.Start();
            OWLOSNodeWrappers.Add(nodeWrapper);
            NewNode(new OWLOSNodeWrapperEventArgs(nodeWrapper));
            */
        }

        public void Save()
        {
            string JSONConfig = JsonConvert.SerializeObject(config);
            File.WriteAllText("config.json", JSONConfig);
        }

        protected virtual void NewNode(OWLOSNodeWrapperEventArgs e)
        {
            OnNewNode?.Invoke(this, e);
        }

    }
}
