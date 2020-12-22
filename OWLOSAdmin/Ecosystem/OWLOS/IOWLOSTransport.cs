using OWLOSAdmin.Ecosystem.OWLOSDTOs;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public interface IOWLOSTransport
    {
        public OWLOSConnection connection { get; set; }

        abstract public Task<DriversDTO> GetAllDriversProperties();
        public DriversDTO GetAllDriversProperties(string data);

    }
}
