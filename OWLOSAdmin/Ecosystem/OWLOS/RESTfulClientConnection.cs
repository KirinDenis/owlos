using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public class RESTfulClientConnection : IOWLOSConnection
    {
        protected string _name = string.Empty;
        public string name { get => _name; set { _name = value; } }
        public ConnectionType connectionType { get => ConnectionType.RESTfulClient; }

        public string host = string.Empty;

        public uint port = 80; 
    }
}
