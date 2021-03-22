using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public enum ConnectionType { RESTfulClient, MQTT, UART }

    interface IOWLOSConnection
    {
        bool enable { get; set; }

        string name { get; set; }

        ConnectionType connectionType { get; set; }

        string connectionString { get; set; }

    }
    public class OWLOSConnection: IOWLOSConnection
    {
        public bool enable { get; set; } = true;

        public string name { get; set; }

        public ConnectionType connectionType { get; set; }

        public string connectionString { get; set; }

    }
}
