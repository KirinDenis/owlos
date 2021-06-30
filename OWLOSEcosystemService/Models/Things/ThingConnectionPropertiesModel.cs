﻿namespace OWLOSEcosystemService.Models.Things
{
    public class ThingConnectionPropertiesModel
    {        
        public uint Id { get; set; }     
        public string Name { get; set; }
        public string Description { get; set; }
        public bool HTTPEnable { get; set; }
        public uint HTTPStatus { get; set; }
        public string HTTPHost { get; set; }
        public uint HTTPPort { get; set; }
        public bool UARTEnable { get; set; }
        public uint UARTStatus { get; set; }
        public string UARTPort { get; set; }
        public uint UARTBaudRate { get; set; }
    }
}
