using OWLOSThingsManager.Ecosystem.OWLOS;
using System.Collections.Generic;

namespace OWLOSEcosystemService.Models.Things
{
    public class ThingWrapperModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public OWLOSFeatures Features { get; set; }

        public RESTfulClientTransport HTTP { get; set; }

        public UARTTransport UART { get; set; }

        public OWLOSThingConfig Config { get; set; }

    }
}
