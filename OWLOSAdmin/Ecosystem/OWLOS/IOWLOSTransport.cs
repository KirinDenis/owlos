using OWLOSAdmin.Ecosystem.OWLOSDTOs;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    interface IOWLOSTransport
    {
        public IOWLOSConnection connection { get; set; }
        public Task<DriversDTO> GetAllDriversProperties();

    }
}
