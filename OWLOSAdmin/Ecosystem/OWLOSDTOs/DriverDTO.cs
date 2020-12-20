using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOSDTOs
{
    public class DriverDTO
    {
        public string name { get; set; }

        public List<DriverPropertyDTO> properties = new List<DriverPropertyDTO>();
    }
}
