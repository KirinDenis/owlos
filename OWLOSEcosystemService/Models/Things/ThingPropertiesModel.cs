using OWLOSThingsManager.Ecosystem.OWLOS;
using System.Collections.Generic;

namespace OWLOSEcosystemService.Models.Things
{
    public class ThingPropertiesModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public OWLOSFeatures Features { get; set; }
        public List<IOWLOSTransport> Transports { get; set; }
        public OWLOSThingConfig Config { get; set; }

    }
}
