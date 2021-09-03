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
using Newtonsoft.Json;
using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSEcosystemService.Services.Things;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OWLOSEcosystemService.Controllers
{

    public class ThingsController : Controller
    {
        #region Controller
        private readonly ILogger<HomeController> _logger;
        private readonly IMapper _mapper;
        private readonly IThingsService _thingsService;

        public ThingsController(ILogger<HomeController> logger, IMapper mapper, IThingsService thingsService)
        {
            _logger = logger;
            _mapper = mapper;
            _thingsService = thingsService;
        }

        private Guid GetUserId()
        {
            if ((User?.Identity as ClaimsIdentity)?.Claims != null)
            {
                IEnumerable<Claim> claims = (User?.Identity as ClaimsIdentity)?.Claims;

                if (claims.Count() > 0)
                {
                    return new Guid(claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
                }
            }

            return Guid.Empty;
        }
        #endregion

        #region Get
        /// <summary>
        /// Returns list of all things wrappers (DEBUG ONLY)
        /// </summary>
        /// <returns>List of things</returns>        
        [Route("Things/GetAllThingsWrappers")]
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
        /// Get user things connections 
        /// </summary>        
        /// <returns></returns>
        [Route("Things/GetThingsConnections")]
        [HttpGet]
        public IActionResult GetThingsConnections()
        {
            Guid UserId = GetUserId();

            if (UserId != Guid.Empty)
            {
                return Ok(_thingsService.GetThingsConnections(UserId));
            }
            return Unauthorized("Wrong claims or not authorize, please SignIn");
        }

        /// <summary>
        /// Get user thing connection 
        /// </summary>        
        /// <returns></returns>
        [Route("Things/GetThingConnection")]
        [HttpGet]
        public IActionResult GetThingConnection(int ThingId)
        {
            Guid UserId = GetUserId();

            if (UserId != Guid.Empty)
            {
                ThingConnectionPropertiesDTO result = _thingsService.GetThingConnection(UserId, ThingId);
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(new ThingsResultModel());
                }
            }
            return Unauthorized("Wrong claims or not authorize, please SignIn");
        }

        /// <summary>
        /// Get user thing air quality
        /// </summary>        
        /// <returns></returns>
        [Route("Things/GetAirQuality")]
        [HttpGet]
        public IActionResult GetAirQuality(int ThingId)
        {
            Guid UserId = GetUserId();

            if (UserId != Guid.Empty)
            {
                ThingAirQualityDTO result = _thingsService.GetThingAirQualityDTO(UserId, ThingId);
                if ((result != null) && (!result.Status.Equals("NOT_FOUND")))
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest("Thing not found");
                }
            }
            return Unauthorized("Wrong claims or not authorize, please SignIn");
        }

        /// <summary>
        /// Get all drivers properties
        /// </summary>        
        /// <returns></returns>
        [Route("Things/GetThingAllDriversProperties")]
        [HttpGet]
        public IActionResult GetThingAllDriversProperties(int ThingId)
        {
            Guid UserId = GetUserId();

            if (UserId != Guid.Empty)
            {

                List<ThingDriverPropertiesDTO> drivers = _thingsService.GetThingAllDriversProperties(UserId, ThingId);
                if (drivers != null)
                {
                    return Ok(drivers);
                }
                else
                {
                    return BadRequest("Thing not found");
                }
            }
            else
            {
                return Unauthorized("Wrong claims or not authorize, please SignIn");
            }
        }


        #endregion

        #region Post
        /// <summary>
        /// Create a new thing connection 
        /// </summary>
        /// <param name="ConnectionPropertiesModel">new connection properties</param>
        /// <returns></returns>
        [Route("Things/NewThingConnection")]
        [HttpPost]
        public IActionResult NewThingConnection(ThingConnectionPropertiesModel ConnectionPropertiesModel)
        {
            Guid UserId = GetUserId();

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
            return Unauthorized("Wrong claims or not authorize, please SignIn");
        }

        /// <summary>
        /// Decode thing token
        /// </summary>       
        /// <returns></returns>
        [Route("Things/GetThingToken")]
        [HttpGet]
        public IActionResult GetThingToken(int thingId)
        {
            ThingTokenDTO thingTokenDTO = new ThingTokenDTO()
            {
                UserId = GetUserId(),
                ThingId = thingId
            };

            Guid token = _thingsService.GetThingToken(thingTokenDTO);
            if (token != Guid.Empty)
            {
                return Ok(token);
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Receive Air Quality data from client Thing 
        /// </summary>       
        /// <returns></returns>
        [Route("Things/AirQuality")]
        [HttpPost]        
        public async Task<IActionResult> AirQuality()
        {
            try
            {
                string body = string.Empty;
                using (StreamReader stream = new StreamReader(HttpContext.Request.Body))
                {
                    body = await stream.ReadToEndAsync();                    
                }

                if (!string.IsNullOrEmpty(body))
                {
                    string result = _thingsService.AirQualityDataToThing(body);
                    if (string.IsNullOrEmpty(result))
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest(result);
                    }
                }
                return BadRequest("Air Quality data is empty or incorrect");
            }
            catch { }

            return BadRequest("Air Quality data parsing problem");
        }

        #endregion

        #region Put
        /// <summary>
        /// Update exists thing connection properties
        /// </summary>
        /// <param name="ConnectionPropertiesModel">connection properties to update</param>
        /// <returns></returns>
        [Route("Things/UpdateThingConnection")]
        [HttpPut]
        public IActionResult UpdateThingConnection(ThingConnectionPropertiesModel ConnectionPropertiesModel)
        {
            Guid UserId = GetUserId();

            if (UserId != Guid.Empty)
            {
                ThingConnectionPropertiesDTO ConnectionPropertiesDTO = _mapper.Map<ThingConnectionPropertiesDTO>(ConnectionPropertiesModel);

                ConnectionPropertiesDTO.UserId = UserId;

                ThingsResultModel resultModel = _thingsService.UpdateThingConnection(ConnectionPropertiesDTO);

                if (!resultModel.Error)
                {
                    return Ok(resultModel.Result);
                }
                else
                {
                    return BadRequest(resultModel.Result);
                }
            }
            return Unauthorized("Wrong claims or not authorize, please SignIn");
        }
        #endregion

        #region Delete
        /// <summary>
        /// Delete exists thing connection properties
        /// </summary>        
        /// <returns></returns>
        [Route("Things/DeleteThingConnection")]
        [HttpDelete]
        public IActionResult DeleteThingConnection(int ThingId)
        {
            Guid UserId = GetUserId();

            if (UserId != Guid.Empty)
            {
                                
                ThingsResultModel resultModel = _thingsService.DeleteThingConnection(UserId, ThingId);

                if (!resultModel.Error)
                {
                    return Ok(resultModel.Result);
                }
                else
                {
                    return BadRequest(resultModel.Result);
                }
            }
            return Unauthorized("Wrong claims or not authorize, please SignIn");
        }
        #endregion

    }
}
