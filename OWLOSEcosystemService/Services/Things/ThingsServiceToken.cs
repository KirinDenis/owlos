using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace OWLOSEcosystemService.Services.Things
{
    public partial class ThingsService : IThingsService
    {
        public Guid CreateThingToken()
        {
            return Guid.NewGuid();
        }


        public Guid GetThingToken(ThingTokenDTO thingTokenDTO)
        {
            return _thingsRepository.GetThingToken(thingTokenDTO);
        }

        public ThingTokenDTO DecodeThingToken(string thingToken)
        {
            if (String.IsNullOrEmpty(thingToken))
            {
                return null;
            }
            

            return null;
        }


    }
}
