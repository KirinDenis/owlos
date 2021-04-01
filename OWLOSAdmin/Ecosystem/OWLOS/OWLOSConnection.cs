using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public enum ConnectionType { RESTfulClient, MQTT, UART }

    public enum APINameType { GetAllDriverProperties, GetAllFiles, GetAllScripts}

    public class APIQueryInterval
    {
        public bool Enable { get; set; } = true;        
        public APINameType APIType { get; set; }
        public uint Interval { get; set; }
        public DateTime LastCall { get; set; }
    }

    interface IOWLOSConnection
    {
        bool enable { get; set; }

        string name { get; set; }

        ConnectionType connectionType { get; set; }

        string connectionString { get; set; }

    }
    public class OWLOSConnection : IOWLOSConnection
    {
        public bool enable { get; set; } = true;

        public uint Priority = 0;

        public string name { get; set; }

        public ConnectionType connectionType { get; set; }

        public string connectionString { get; set; }

        public List<APIQueryInterval> APIQueryIntervals { get; set; } = new List<APIQueryInterval>() {
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
    }
}
