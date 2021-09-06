using System.Collections.Generic;

namespace OWLOSEcosystemService.DTO.Things
{
    public class ThingDriverPropertyDTO
    {
        public string name { get; set; }
        public string value { get; set; }
    }

    public class ThingDriverPropertiesDTO
    {
        public string name { get; set; }

        public List<ThingDriverPropertyDTO> properties { get; set; }
    }
}
