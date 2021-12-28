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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSEcosystemService.Services.Things;
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

        /// <summary>
        /// Decode and check user token 
        /// </summary>
        /// <param name="userToken">user token to check</param>
        /// <param name="thingId">thingId if exists</param>
        /// <returns>OK: ThingTokenDTO, Bad: AccessViolationException</returns>
        private ThingTokenDTO DecodeUserToken(string userToken, int? thingId = null)
        {
            ThingTokenDTO thingTokenDTO = _thingsService.DecodeUserToken(userToken);

            if ((thingTokenDTO == null) || (thingTokenDTO.UserId == Guid.Empty))
            {
                return null;
            }

            if ((thingTokenDTO.ThingId == -1) && (thingId != null))
            {
                thingTokenDTO.ThingId = (int)thingId;
            }

            return thingTokenDTO;
        }

        #endregion

        #region Get
        /// <summary>
        /// Returns list of all things wrappers (DEBUG ONLY)
        /// </summary>
        /// <param name="userToken">user access token</param>
        /// <returns>HTTP Result Ok and List of things</returns>        
        [Route("Things/GetAllThingsWrappers")]
        [HttpGet]
        public IActionResult Get(string userToken)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, null);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            List<ThingWrapperModel> result = _thingsService.GetThingsWrappers();

            if (result.Count != 0)
            {
                return Ok(result);
            }
            else
            {
                //TODO: Dictionary for messaging
                return StatusCode(StatusCodes.Status403Forbidden, "things core not ready or no one thing at ecosystem");
            }
        }

        /// <summary>
        /// Get user things connections 
        /// </summary>        
        /// <param name="userToken">user access token</param>
        /// <returns>HTTP Result Ok and user things connections data</returns>
        [Route("Things/GetThingsConnections")]
        [HttpGet]
        public IActionResult GetThingsConnections(string userToken)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, null);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            return Ok(_thingsService.GetThingsConnections(thingTokenDTO.UserId));
        }

        /// <summary>
        /// Get selected user thing connection 
        /// </summary>        
        /// <param name="userToken">user access token</param>
        /// <param name="thingId">user thing id</param>
        /// <returns>HTTP Result Ok and user thing connection data</returns>
        [Route("Things/GetThingConnection")]
        [HttpGet]
        public IActionResult GetThingConnection(string userToken, int? thingId = null)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, thingId);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }
            else
            if (thingTokenDTO.ThingId == -1)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "missing thing id");
            }

            ThingConnectionPropertiesDTO result = _thingsService.GetThingConnection(thingTokenDTO.UserId, thingTokenDTO.ThingId);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, new ThingsResultModel());
            }
        }
        #endregion

        #region AirQuality
        //------------------- Receive Air Quality APIs ---------------------------------------------------------------------------------

        /// <summary>
        /// Get user thing's last received air quality from thing (object model, with out repository)
        /// </summary>        
        /// <param name="userToken">user access token</param>
        /// <param name="thingId">user thing id</param>
        /// <returns>HTTP Result Ok air quality data</returns>
        [Route("Things/GetDirectLastThingAQ")]
        [HttpGet]
        public IActionResult GetDirectLastThingAQ(string userToken, int? thingId = null)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, thingId);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }
            else
            if (thingTokenDTO.ThingId == -1)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "missing thing id");
            }

            ThingAirQualityDTO result = _thingsService.GetDirectLastThingAQ(thingTokenDTO.UserId, thingTokenDTO.ThingId);
            if ((result != null) && (!result.Status.Equals("NOT_FOUND")))
            {
                return Ok(result);
            }
            return StatusCode(StatusCodes.Status400BadRequest, "Thing not found");
        }

        /// <summary>
        /// Get user thing's last received air quality
        /// </summary>        
        /// <param name="userToken">user access token</param>
        /// <param name="thingId">user thing id</param>
        /// <returns>HTTP Result Ok air quality data</returns>
        [Route("Things/GetLastThingAQ")]
        [HttpGet]
        public IActionResult GetLastThingAQ(string userToken, int? thingId = null)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, thingId);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }
            else
            if (thingTokenDTO.ThingId == -1)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "missing thing id");
            }

            ThingAirQualityDTO result = _thingsService.GetLastThingAQ(thingTokenDTO.UserId, thingTokenDTO.ThingId);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(StatusCodes.Status400BadRequest, "Thing air quality data not found");
        }

        /// <summary>
        /// Get user thing's last hour received air quality
        /// </summary>        
        /// <param name="userToken">user access token</param>
        /// <param name="thingId">user thing id</param>
        /// <returns>HTTP Result Ok air quality data</returns>
        [Route("Things/GetLastHourThingAQ")]
        [HttpGet]
        public IActionResult GetLastHourThingAQ(string userToken, int? thingId = null)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, thingId);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }
            else
            if (thingTokenDTO.ThingId == -1)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "missing thing id");
            }

            List<ThingAirQualityDTO> result = _thingsService.GetLastHourThingAQ(thingTokenDTO.UserId, thingTokenDTO.ThingId);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(StatusCodes.Status400BadRequest, "Thing air quality data not found");
        }

        /// <summary>
        /// Get user thing's last day received air quality
        /// </summary>        
        /// <param name="userToken">user access token</param>
        /// <param name="thingId">user thing id</param>
        /// <returns>HTTP Result Ok air quality data</returns>
        [Route("Things/GetLastDayThingAQ")]
        [HttpGet]
        public IActionResult GetLastDayThingAQ(string userToken, int? thingId = null)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, thingId);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }
            else
            if (thingTokenDTO.ThingId == -1)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "missing thing id");
            }

            List<ThingAirQualityDTO> result = _thingsService.GetLastDayThingAQ(thingTokenDTO.UserId, thingTokenDTO.ThingId);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(StatusCodes.Status400BadRequest, "Thing air quality data not found");
        }

        /// <summary>
        /// Get all drivers properties
        /// </summary>        
        /// <param name="userToken">user access token</param>
        /// <param name="thingId">user thing id</param>
        /// <returns>HTTP Result Ok and all drivers properties</returns>
        [Route("Things/GetThingAllDriversProperties")]
        [HttpGet]
        public IActionResult GetThingAllDriversProperties(string userToken, int? thingId = null)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, thingId);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }
            else
            if (thingTokenDTO.ThingId == -1)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "missing thing id");
            }

            List<ThingDriverPropertiesDTO> drivers = _thingsService.GetThingAllDriversProperties(thingTokenDTO.UserId, thingTokenDTO.ThingId);
            if (drivers != null)
            {
                return Ok(drivers);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Thing not found");
            }
        }
        #endregion

        #region Post
        /// <summary>
        /// Create a new thing connection 
        /// </summary>
        /// <param name="userToken">user access token</param>
        /// <param name="ConnectionPropertiesModel">new connection properties</param>
        /// <returns>HTTP Result Ok if added</returns>
        [Route("Things/NewThingConnection")]
        [HttpPost]
        public IActionResult NewThingConnection(string userToken, ThingConnectionPropertiesModel ConnectionPropertiesModel)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            ThingConnectionPropertiesDTO ConnectionPropertiesDTO = _mapper.Map<ThingConnectionPropertiesDTO>(ConnectionPropertiesModel);

            ConnectionPropertiesDTO.UserId = thingTokenDTO.UserId;

            ThingsResultModel resultModel = _thingsService.NewThingConnection(ConnectionPropertiesDTO);

            if (!resultModel.Error)
            {
                return Ok(resultModel.Result);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, resultModel.Result);
            }
        }

        /// <summary>
        /// Get user token
        /// </summary>       
        /// <returns>HTTP Result Ok and Guid token</returns>
        [Route("Things/GetUserToken")]
        [HttpGet]
        public ActionResult<Guid> GetUserToken()
        {
            Guid userId = GetUserId();

            if (userId == Guid.Empty)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            ThingTokenDTO thingTokenDTO = new ThingTokenDTO()
            {
                UserId = userId,
                ThingId = -1 // -1 means token for all user things
            };

            string token = _thingsService.GetUserToken(thingTokenDTO);
            if (!string.IsNullOrEmpty(token))
            {
                return Ok(token);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }
        }

        /// <summary>
        /// Get thing token
        /// </summary>       
        /// <param name="userToken">user access token</param>
        /// <param name="thingId">user thing id</param>
        /// <returns>HTTP Result Ok and thing token string</returns>
        [Route("Things/GetThingToken")]
        [HttpGet]
        public ActionResult<string> GetThingToken(string userToken, int? thingId = null)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            if (thingId != null)
            {
                thingTokenDTO.ThingId = (int)thingId;
            }

            if (thingTokenDTO.ThingId == -1)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Thing id is missing");
            }

            Guid token = _thingsService.GetThingToken(thingTokenDTO);
            if (token != Guid.Empty)
            {
                return Ok(token);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }
        }

        /// <summary>
        /// Receive Air Quality data from client Thing 
        /// </summary>       
        /// <returns>Ok if received</returns>
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
                        return StatusCode(StatusCodes.Status400BadRequest, result);
                    }
                }
                return StatusCode(StatusCodes.Status400BadRequest, "Air Quality data is empty or incorrect");
            }
            catch { }

            return StatusCode(StatusCodes.Status400BadRequest, "Air Quality data parsing problem");
        }
        #endregion

        #region Put
        /// <summary>
        /// Update exists thing connection properties
        /// </summary>
        /// <param name="userToken">user access token</param>
        /// <param name="ConnectionPropertiesModel">connection properties to update</param>
        /// <returns>Ok if updated</returns>
        [Route("Things/UpdateThingConnection")]
        [HttpPut]
        public IActionResult UpdateThingConnection(string userToken, ThingConnectionPropertiesModel ConnectionPropertiesModel)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            ThingConnectionPropertiesDTO ConnectionPropertiesDTO = _mapper.Map<ThingConnectionPropertiesDTO>(ConnectionPropertiesModel);

            ConnectionPropertiesDTO.UserId = thingTokenDTO.UserId;

            ThingsResultModel resultModel = _thingsService.UpdateThingConnection(ConnectionPropertiesDTO);

            if (!resultModel.Error)
            {
                return Ok(resultModel.Result);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, resultModel.Result);
            }
        }
        #endregion

        #region Delete
        /// <summary>
        /// Delete exists thing connection properties
        /// </summary>        
        /// <param name="userToken">user access token</param>
        /// <param name="thingId">user thing id</param>
        /// <returns>HTTP Code Ok if deleted</returns>
        [Route("Things/DeleteThingConnection")]
        [HttpDelete]
        public IActionResult DeleteThingConnection(string userToken, int? ThingId = null)
        {
            ThingTokenDTO thingTokenDTO = DecodeUserToken(userToken, ThingId);

            if (thingTokenDTO == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            ThingsResultModel resultModel = _thingsService.DeleteThingConnection(thingTokenDTO.UserId, thingTokenDTO.ThingId);

            if (!resultModel.Error)
            {
                return Ok(resultModel.Result);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, resultModel.Result);
            }
        }
        #endregion
    }
}
