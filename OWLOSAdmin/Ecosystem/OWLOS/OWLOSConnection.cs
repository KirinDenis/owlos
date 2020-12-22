using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public enum ConnectionType { RESTfulClient, MQTT, UART }
    public class OWLOSConnection
    {
        public string name;

        public ConnectionType connectionType;

        public string host;

        public uint port = 80;
    }
}
