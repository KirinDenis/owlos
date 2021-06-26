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

using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSEcosystemService.Repository.Things;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System.Collections.Generic;
using System.Threading;

namespace OWLOSEcosystemService.Services.Things
{
    public class ThingsService: IThingsService
    {
        #region IThingService
        private readonly IThingsRepository _thingsRepository;

        private readonly Thread _thingsManagerTread;

        public ThingsService()
        {
            _thingsRepository =  new ThingsRepository();

            _thingsManagerTread = new Thread(ThingsService.Start);
            _thingsManagerTread.Start();
        }

        public ThingsResultModel NewThingConnection(ThingConnectionPropertiesDTO ConnectionPropertiesDTO)
        {
            ThingsResultModel resultModel = new ThingsResultModel();

            if ((ConnectionPropertiesDTO == null) || string.IsNullOrEmpty(ConnectionPropertiesDTO.Name))
            {
                resultModel.Result = "Bad connection properties model";
                return resultModel;
            }

            return _thingsRepository.NewThingConnection(ConnectionPropertiesDTO);
        }
        #endregion


        #region ThingsThreadManager
        public static ThingsManager thingsManager = null;
        public static void Start()
        {
            thingsManager = new ThingsManager();
            thingsManager.OnNewThing += ThingsManager_OnNewThing;
            thingsManager.Load();
        }

        public static List<ThingPropertiesModel> GetThings()
        {
            List<ThingPropertiesModel> result = new List<ThingPropertiesModel>();

            int temporaryIdCount = 1;

            foreach (OWLOSThingWrapper wrapper in thingsManager.OWLOSThingWrappers)
            {
                result.Add(new ThingPropertiesModel()
                { 
                    Id = temporaryIdCount,
                    Name = wrapper.Thing.Name,
                    Features = wrapper.Thing.Features,
                    Transports = wrapper.Thing.transports,
                    Config = wrapper.Thing.config
                });
                temporaryIdCount++;
            }

            return result;
        }

        public static string GetThingsDrivers()
        {
            string result = string.Empty;
            foreach (OWLOSThingWrapper wrapper in thingsManager.OWLOSThingWrappers)
            {
                result += "thing: " + wrapper.Thing.Name + "\n";
                foreach (OWLOSDriver driver in wrapper.Thing.drivers)
                {
                    result += " - driver: " + driver.name + "\n";
                    for (int i = 0; i < driver.properties.Count; i++)
                    {
                        result += " -- " + driver.properties[i].name + ":" + driver.properties[i].value + " flags: " + driver.properties[i].flags + "\n";
                    }
                }
            }

            return result;
        }
        private static void ThingsManager_OnNewThing(object sender, OWLOSThingWrapperEventArgs e)
        {
            if (e.ThingWrapper != null)
            {

            }
        }
        #endregion
    }
}
