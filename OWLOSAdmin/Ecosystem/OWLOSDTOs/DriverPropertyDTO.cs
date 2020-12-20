using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOSDTOs
{
    public enum DriverPropertyType { ReadOnly, Selected, Password, Float, Integer, Boolean }
    public class DriverPropertyDTO
    {
        public string name { get; set; }
        public string value { get; set; }

        public DriverPropertyType propType { get; set; }
    }
}
