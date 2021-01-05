using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public enum ConnectionType { RESTfulClient, MQTT, UART }
    public class OWLOSConnection
    {
        public bool enable;

        public string name;

        public ConnectionType connectionType;

        public string connectionString;

        
    }
}
