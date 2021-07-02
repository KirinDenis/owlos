using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;

namespace OWLOSEcosystemService.Models.Things
{
    public class ThingWrapperModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public uint DbId { get; set; }

        public Guid UserId { get; set; }

        public DateTime LastConnected { get; set; }

        public OWLOSFeatures Features { get; set; }

        public RESTfulClientTransport HTTP { get; set; }

        public UARTTransport UART { get; set; }

        public OWLOSThingConfig Config { get; set; }

    }
}
