/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSEcosystemService.Services.Things;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace OWLOSEcosystemService.Controllers
{

    public class ThingsController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IMapper _mapper;
        private readonly IThingsService _thingsService;
        
        public ThingsController(ILogger<HomeController> logger, IMapper mapper, IThingsService thingsService)
        {
            _logger = logger;
            _mapper = mapper;
            _thingsService = thingsService;
        }
        
        /// <summary>
        /// Returns list of all things
        /// </summary>
        /// <returns>List of things</returns>
        [Route("Things")]
        [Route("Things/Get")]
        [HttpGet]
        public IActionResult Get()
        {
            List<ThingWrapperModel> result = _thingsService.GetThingsWrappers(); 

            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                //TODO: Dictionary for messaging
                return Forbid("Things core not ready or no one thing at ecosystem");
            }            
        }

        /// <summary>
        /// Create a new thing connection 
        /// </summary>
        /// <param name="ConnectionPropertiesModel">new connection properties</param>
        /// <returns></returns>
        [Route("Things/NewThingConnection")]
        [HttpPost]
        public IActionResult NewThingConnection(ThingConnectionPropertiesModel ConnectionPropertiesModel)
        {
            if ((User?.Identity as ClaimsIdentity)?.Claims != null)
            {
                IEnumerable<Claim> claims = (User?.Identity as ClaimsIdentity)?.Claims;

                if (claims.Count() > 0)
                {

                    Guid UserId = new Guid(claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

                    if (UserId != Guid.Empty)
                    {

                        ThingConnectionPropertiesDTO ConnectionPropertiesDTO = _mapper.Map<ThingConnectionPropertiesDTO>(ConnectionPropertiesModel);

                        ConnectionPropertiesDTO.UserId = UserId;

                        ThingsResultModel resultModel = _thingsService.NewThingConnection(ConnectionPropertiesDTO);

                        if (!resultModel.Error)
                        {
                            return Ok(resultModel.Result); 
                        }
                        else
                        {
                            return BadRequest(resultModel.Result);
                        }
                    }
                    return Forbid("Bad claims or not authorize, please try SignIn again");
                }                                
                return Unauthorized("Wrong claims or not authorize, please try SignIn again");                                
            }                        
            return Unauthorized("Not authorize");            
        }
    }
}
