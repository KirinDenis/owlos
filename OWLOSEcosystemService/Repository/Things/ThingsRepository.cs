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
using Microsoft.EntityFrameworkCore.ChangeTracking;
using OWLOSEcosystemService.Data;
using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
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

        public ThingsResultModel AddAirQuality(Guid UserId, int ThingId, ThingAirQualityModel AirQualityModel)
        {

            ThingsResultModel resultModel = new ThingsResultModel();

            using (ThingsDbContext db = new ThingsDbContext())
            {
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
    }
}

