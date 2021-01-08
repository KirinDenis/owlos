using OWLOSAdmin.Ecosystem.OWLOSDTOs;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public interface IOWLOSTransport
    {
        public object tag { get; set; }
        public OWLOSConnection connection { get; set; }

        delegate void TransportEventHandler(object? sender, NetworkStatus e);

        event TransportEventHandler OnTransportStatusChanger;
        abstract public Task<DriversDTO> GetAllDriversProperties();
        public DriversDTO GetAllDriversProperties(string data);

    }
}
