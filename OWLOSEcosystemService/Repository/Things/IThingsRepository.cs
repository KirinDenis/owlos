﻿/* ----------------------------------------------------------------------------
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

using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;

namespace OWLOSEcosystemService.Repository.Things
{
    public interface IThingsRepository
    {
        #region Connection
        List<ThingConnectionPropertiesDTO> GetThingsConnections(Guid UserId);
        ThingConnectionPropertiesDTO GetThingConnection(Guid UserId, int ThingId);
        ThingsResultModel NewThingConnection(ThingConnectionPropertiesDTO ConnectionPropertiesDTO);
        ThingsResultModel UpdateThingConnection(ThingConnectionPropertiesDTO ConnectionPropertiesDTO);
        List<ThingConnectionPropertiesDTO> GetAllThingsConnections();
        ThingsResultModel DeleteThingConnection(Guid UserId, int ThingId);
        #endregion

        #region Token
        Guid GetThingToken(ThingTokenDTO thingTokenDTO);
        public ThingConnectionPropertiesDTO GetThingConnectionByToken(Guid tokenGuid);
        #endregion

        #region AirQuality
        ThingsResultModel AddAirQuality(OWLOSThing thing);
        ThingAirQualityDTO GetLastThingAQ(Guid UserId, int ThingId);        
        List<ThingAirQualityDTO> GetLastHourThingAQ(Guid UserId, int ThingId);
        List<ThingAirQualityDTO> GetLastDayThingAQ(Guid UserId, int ThingId);
        #endregion


    }
}
