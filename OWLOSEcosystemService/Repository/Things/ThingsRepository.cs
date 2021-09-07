/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
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
using Microsoft.EntityFrameworkCore.ChangeTracking;
using OWLOSEcosystemService.Data;
using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OWLOSEcosystemService.Repository.Things
{
    public class ThingsRepository : IThingsRepository
    {
        private readonly IMapper _mapper;

        public ThingsRepository(IMapper mapper)
        {
            _mapper = mapper;
        }

        #region Connections
        public List<ThingConnectionPropertiesDTO> GetThingsConnections(Guid UserId)
        {
            List<ThingConnectionPropertiesDTO> result = new List<ThingConnectionPropertiesDTO>();

            using (ThingsDbContext db = new ThingsDbContext())
            {
                List<ThingConnectionPropertiesDTO> ConnectionsPropertiesEntity = db.ThingConnectionProperties.Where<ThingConnectionPropertiesDTO>(c => c.UserId.Equals(UserId)).ToList();
                result = _mapper.Map<List<ThingConnectionPropertiesDTO>>(ConnectionsPropertiesEntity);
            }
            return result;
        }

        public ThingConnectionPropertiesDTO GetThingConnection(Guid UserId, int ThingId)
        {
            ThingConnectionPropertiesDTO result = null;

            using (ThingsDbContext db = new ThingsDbContext())
            {
                ThingConnectionPropertiesDTO ConnectionPropertiesEntity = db.ThingConnectionProperties.FirstOrDefault<ThingConnectionPropertiesDTO>(c => c.UserId.Equals(UserId) && c.Id == ThingId);
                result = _mapper.Map<ThingConnectionPropertiesDTO>(ConnectionPropertiesEntity);
            }
            return result;
        }

        public ThingsResultModel NewThingConnection(ThingConnectionPropertiesDTO ConnectionPropertiesDTO)
        {
            ThingsResultModel resultModel = new ThingsResultModel();

            using (ThingsDbContext db = new ThingsDbContext())
            {
                EntityEntry<ThingConnectionPropertiesDTO> ConnectionPropertiesEntity = db.Add(ConnectionPropertiesDTO);
                db.SaveChanges();
                if (ConnectionPropertiesEntity != null)
                {
                    resultModel.Error = false;
                    resultModel.Result = ConnectionPropertiesEntity.Entity.Id.ToString();
                }
                else
                {
                    resultModel.Result = "repository problem, result entity is null";
                }
            }

            return resultModel;
        }

        public ThingsResultModel UpdateThingConnection(ThingConnectionPropertiesDTO ConnectionPropertiesDTO)
        {
            ThingsResultModel resultModel = new ThingsResultModel();

            using (ThingsDbContext db = new ThingsDbContext())
            {
                EntityEntry<ThingConnectionPropertiesDTO> ConnectionPropertiesEntity = db.Update(ConnectionPropertiesDTO);
                db.SaveChanges();
                if (ConnectionPropertiesEntity != null)
                {
                    resultModel.Error = false;
                    resultModel.Result = ConnectionPropertiesEntity.Entity.Id.ToString();
                }
                else
                {
                    resultModel.Result = "repository problem, result entity is null";
                }
            }
            return resultModel;
        }

        public ThingsResultModel DeleteThingConnection(Guid UserId, int ThingId)
        {
            ThingsResultModel resultModel = new ThingsResultModel();

            using (ThingsDbContext db = new ThingsDbContext())
            {
                ThingConnectionPropertiesDTO ConnectionPropertiesEntity = db.ThingConnectionProperties.FirstOrDefault<ThingConnectionPropertiesDTO>(c => c.UserId.Equals(UserId) && c.Id == ThingId);
                if (ConnectionPropertiesEntity != null)
                {
                    db.Remove(ConnectionPropertiesEntity);
                    db.SaveChanges();
                    resultModel.Error = false;
                    resultModel.Result = ThingId.ToString();
                }
                else
                {
                    resultModel.Result = "repository problem, result entity is null";
                }
            }
            return resultModel;
        }

        public List<ThingConnectionPropertiesDTO> GetAllThingsConnections()
        {
            List<ThingConnectionPropertiesDTO> result = new List<ThingConnectionPropertiesDTO>();

            using (ThingsDbContext db = new ThingsDbContext())
            {
                List<ThingConnectionPropertiesDTO> ConnectionPropertiesEntity = db.Set<ThingConnectionPropertiesDTO>().ToList();
                result = _mapper.Map<List<ThingConnectionPropertiesDTO>>(ConnectionPropertiesEntity);
            }
            return result;
        }
        #endregion

        #region Token
        public Guid GetThingToken(ThingTokenDTO thingTokenDTO)
        {
            if (thingTokenDTO == null)
            {
                return Guid.Empty;
            }

            ThingConnectionPropertiesDTO thingConnectionPropertiesDTO = GetThingConnection(thingTokenDTO.UserId, thingTokenDTO.ThingId);

            if (thingConnectionPropertiesDTO != null)
            {
                return thingConnectionPropertiesDTO.Token;
            }
            else
            {
                return Guid.Empty;
            }
        }

        public ThingConnectionPropertiesDTO GetThingConnectionByToken(Guid tokenGuid)
        {
            if (tokenGuid == Guid.Empty)
            {
                return null;
            }

            using (ThingsDbContext db = new ThingsDbContext())
            {
                ThingConnectionPropertiesDTO ConnectionPropertiesEntity = db.ThingConnectionProperties.FirstOrDefault<ThingConnectionPropertiesDTO>(c => c.Token.Equals(tokenGuid));
                return ConnectionPropertiesEntity;
            }
        }
        #endregion

        #region AirQuality
        public ThingsResultModel AddAirQuality(OWLOSThing thing)
        {
            ThingsResultModel resultModel = new ThingsResultModel();

            if ((thing == null) || (thing.config == null) || (thing.config.UserId == Guid.Empty))
            {
                resultModel.Error = true;
                resultModel.Result = "Bad thing";
                return resultModel;
            }

            ThingConnectionPropertiesDTO thingConnectionPropertiesDTO = GetThingConnection(thing.config.UserId, thing.config.ThingId);

            if (thingConnectionPropertiesDTO == null)
            {
                resultModel.Error = true;
                resultModel.Result = "Bad user id or thing id";
                return resultModel;
            }
            
            ThingAirQualityDTO thingAirQualityDTO = null;

            //if thing never connected or last session (connection) time up to 70 seconds
            if ((thing.lastAirQulityRecievedData == null) || (thing.lastSessionTime == null) || (DateTime.Now.Subtract((DateTime)thing.lastSessionTime).TotalSeconds > 10)) //10 sec for debugging
            {
                thingAirQualityDTO = new ThingAirQualityDTO();  //Empty data with error
            }
            else
            {
                //transfer data 
                thingAirQualityDTO = thing.lastAirQulityRecievedData as ThingAirQualityDTO;
            }

            //reset stored data 
            //thing.lastAirQulityRecievedData = new ThingAirQualityDTO();
            thingAirQualityDTO.QueryTime = DateTime.Now;

           
            using (ThingsDbContext db = new ThingsDbContext())
            {
                ThingAirQualityModel AirQualityModel = _mapper.Map<ThingAirQualityModel>(thingAirQualityDTO);

                AirQualityModel.ThingId = thing.config.ThingId;

                EntityEntry<ThingAirQualityModel> AirQualityEntity = db.Add(AirQualityModel);
                db.SaveChanges();
                if (AirQualityEntity != null)
                {
                    resultModel.Error = false;
                }
                else
                {
                    resultModel.Result = "repository problem, result entity is null";
                }
            }

            return resultModel;
        }

        public ThingAirQualityDTO GetLastThingAQ(Guid UserId, int ThingId)
        {
            ThingConnectionPropertiesDTO thingConnectionPropertiesDTO = GetThingConnection(UserId, ThingId);

            if (thingConnectionPropertiesDTO == null)
            {
                throw new AccessViolationException("Not user and thing related to current token");
            }

            using (ThingsDbContext db = new ThingsDbContext())
            {
                DateTime? dateTime = db.ThingAirQuality.Where<ThingAirQualityModel>(c => c.ThingId == ThingId).Max(x => x.QueryTime);
                ThingAirQualityModel AirQualityModel = db.ThingAirQuality.FirstOrDefault<ThingAirQualityModel>(c => c.QueryTime == dateTime);
                
                if (AirQualityModel != null)
                {
                    return _mapper.Map<ThingAirQualityDTO>(AirQualityModel);
                }
            }
            return null;
        }

        public  List<ThingAirQualityDTO> GetLastHourThingAQ(Guid UserId, int ThingId)
        {
            ThingConnectionPropertiesDTO thingConnectionPropertiesDTO = GetThingConnection(UserId, ThingId);

            if (thingConnectionPropertiesDTO == null)
            {
                throw new AccessViolationException("Not user and thing related to current token");
            }

            using (ThingsDbContext db = new ThingsDbContext())
            {
                //FFR: with filter if it needed -> var a  = db.ThingAirQuality.Where(c => c.ThingId == ThingId && c.QueryTime >= (DateTime.Now.AddHours(-1))).Select(c => new { c.DHT22temp }).ToList();

                List<ThingAirQualityModel> AirQualityModels = db.ThingAirQuality.Where(c => c.ThingId == ThingId && c.QueryTime >= (DateTime.Now.AddHours(-1))).ToList();

                if (AirQualityModels != null)                
                {
                    return _mapper.Map<List<ThingAirQualityDTO>>(AirQualityModels);                    
                }
            }
            return null;
        }


        #endregion
    }
}

