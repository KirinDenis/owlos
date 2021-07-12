using System;

namespace OWLOSEcosystemService.DTO.Things
{
    public class ThingTokenDTO
    {
        public Guid UserId { get; set; }

        public int ThingId { get; set; }

        public DateTime CreationDateTime { get; set; }
    }
}
