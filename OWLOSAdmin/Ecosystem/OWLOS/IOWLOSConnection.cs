using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public enum ConnectionType {RESTfulClient, MQTT, UART }
    public interface IOWLOSConnection
    {
        public string name { get; set; }
        public ConnectionType connectionType { get; }
        
    }
}
