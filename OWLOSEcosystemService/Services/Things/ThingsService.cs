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

using MapsterMapper;
using Newtonsoft.Json;
using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Models.Things;
using OWLOSEcosystemService.Repository.Things;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Threading;

namespace OWLOSEcosystemService.Services.Things
{
    public partial class ThingsService : IThingsService
    {
        #region IThingService
        private static IThingsRepository _thingsRepository;
        private readonly IMapper _mapper;

        private readonly Thread _thingsManagerTread;

        public ThingsService()
        {
            _mapper = new Mapper();
            ThingsService._thingsRepository =  new ThingsRepository(_mapper);


            thingsManager = new ThingsManager();
            thingsManager.OnNewThing += ThingsManager_OnNewThing;

            _thingsManagerTread = new Thread(new ParameterizedThreadStart(ThingsService.Start));
            _thingsManagerTread.Start(this);
        }

        public ThingsResultModel NewThingConnection(ThingConnectionPropertiesDTO connectionPropertiesDTO)
        {
            ThingsResultModel resultModel = new ThingsResultModel();

            if ((connectionPropertiesDTO == null) || string.IsNullOrEmpty(connectionPropertiesDTO.Name))
            {
                resultModel.Result = "Bad connection properties model";
                return resultModel;
            }

            if ((connectionPropertiesDTO.HTTPEnable) && (!string.IsNullOrEmpty(connectionPropertiesDTO.HTTPHost)))
            {
                connectionPropertiesDTO.HTTPHost = connectionPropertiesDTO.HTTPHost.Trim();
                if (connectionPropertiesDTO.HTTPHost.ToLower().IndexOf("http://") != 0)
                {
                    connectionPropertiesDTO.HTTPHost = "http://" + connectionPropertiesDTO.HTTPHost;
                }
            }

            connectionPropertiesDTO.Token = CreateThingToken();

            resultModel = _thingsRepository.NewThingConnection(connectionPropertiesDTO);

            if (!resultModel.Error)
            {
                ThingTokenDTO thingToken = new ThingTokenDTO
                {
                    UserId = connectionPropertiesDTO.UserId,
                    ThingId = int.Parse(resultModel.Result)
                };

                connectionPropertiesDTO.Token = GetThingToken(thingToken);

                _thingsRepository.UpdateThingConnection(connectionPropertiesDTO);

                

                connectionPropertiesDTO.Id = int.Parse(resultModel.Result);
                AddThingToEcosystem(connectionPropertiesDTO);
            }

            return resultModel;
        }

        public ThingsResultModel UpdateThingConnection(ThingConnectionPropertiesDTO ConnectionPropertiesDTO)
        {
            return _thingsRepository.UpdateThingConnection(ConnectionPropertiesDTO);
        }

        public List<ThingConnectionPropertiesDTO> GetThingsConnections(Guid UserId)
        {
            return _thingsRepository.GetThingsConnections(UserId);
        }

        public ThingConnectionPropertiesDTO GetThingConnection(Guid UserId, int ThingId)
        {
            return _thingsRepository.GetThingConnection(UserId, ThingId);
        }

        public ThingsResultModel DeleteThingConnection(Guid UserId, int ThingId)
        {
            ThingsResultModel result = _thingsRepository.DeleteThingConnection(UserId, ThingId);

            if (!result.Error)
            {
                result.Error = true;
                foreach (OWLOSThingWrapper wrapper in thingsManager.OWLOSThingWrappers)
                {
                    if ((wrapper.Thing.config.UserId.Equals(UserId)) && (wrapper.Thing.config.ThingId == ThingId))
                    {
                        thingsManager.DeleteThingWrapper(wrapper);
                        result.Error = false;
                        break;
                    }
                }                    
            }
            return result;
        }

        public List<ThingWrapperModel> GetThingsWrappers()
        {
            List<ThingWrapperModel> result = new List<ThingWrapperModel>();

            int temporaryIdCount = 1;

            foreach (OWLOSThingWrapper wrapper in thingsManager.OWLOSThingWrappers)
            {
                //clear transports logs
                ThingWrapperModel thingWrapperModel = new ThingWrapperModel()
                {
                    Id = temporaryIdCount,
                    Name = wrapper.Thing.Name,
                    DbId = wrapper.Thing.config.ThingId,
                    UserId = wrapper.Thing.config.UserId,
                    LastConnected = wrapper.Thing.config.LastConnected,
                    Features = wrapper.Thing.Features,                        
                    Config = wrapper.Thing.config
                };

                thingWrapperModel.HTTP = new RESTfulClientTransport(null)
                {
                    totlaSend = wrapper.Thing._RESTfulClientTransport.totlaSend,
                    totlaRecv = wrapper.Thing._RESTfulClientTransport.totlaRecv,
                    connection = wrapper.Thing._RESTfulClientTransport.connection
                };

                thingWrapperModel.UART = new UARTTransport(null)
                {
                    totlaSend = wrapper.Thing._UARTTransport.totlaSend,
                    totlaRecv = wrapper.Thing._UARTTransport.totlaRecv,
                    connection = wrapper.Thing._UARTTransport.connection
                };

                result.Add(thingWrapperModel);

                temporaryIdCount++;
            }
            return result;
        }
       
        private bool AddThingToEcosystem(ThingConnectionPropertiesDTO connectionPropertiesDTO)
        {
            OWLOSThingConfig _OWLOSThingConfig = new OWLOSThingConfig
            {
                Name = connectionPropertiesDTO.Name,
                ThingId = connectionPropertiesDTO.Id, 
                UserId = connectionPropertiesDTO.UserId
            };

            OWLOSConnection _connection = new OWLOSConnection
            {
                connectionType = ConnectionType.RESTfulClient,
                enable = connectionPropertiesDTO.HTTPEnable,
                Priority = 0,
                name = "HTTPClient",
                connectionString = JsonConvert.SerializeObject(new RESTfulClientConnectionDTO()
                {
                    host = connectionPropertiesDTO.HTTPHost + ":" + connectionPropertiesDTO.HTTPPort + "/"
                })
            };
            _OWLOSThingConfig.connections.Add(_connection);

            _connection = new OWLOSConnection
            {
                connectionType = ConnectionType.UART,
                enable = connectionPropertiesDTO.UARTEnable,
                Priority = 1,
                name = "UART",
                connectionString = JsonConvert.SerializeObject(new UARTClientConnectionDTO()
                {
                    port = connectionPropertiesDTO.UARTPort,
                    baudRate = connectionPropertiesDTO.UARTBaudRate,
                    parity = System.IO.Ports.Parity.None,
                    stopBits = System.IO.Ports.StopBits.One,
                    dataBits = 8,
                    handshake = System.IO.Ports.Handshake.None,
                    RTSEnable = false
                })
            };

            if (string.IsNullOrEmpty(connectionPropertiesDTO.UARTPort) || connectionPropertiesDTO.UARTBaudRate == 0)
            {
                _connection.enable = false;
            }


            _OWLOSThingConfig.connections.Add(_connection);

            _connection = new OWLOSConnection
            {
                connectionType = ConnectionType.MQTT,
                enable = false,
                Priority = 2,
                name = "MQTTClient",
                connectionString = string.Empty
            };
            _OWLOSThingConfig.connections.Add(_connection);

            //Get All drivers properties enabled only
            _OWLOSThingConfig.APIQueryIntervals.Add(new APIQueryInterval()
            {
                APIType = APINameType.GetAllDriverProperties,
                Enable = true,
                Interval = 60
            });

            _OWLOSThingConfig.APIQueryIntervals.Add(new APIQueryInterval()
            {
                APIType = APINameType.GetAllFiles,
                Enable = false,
                Interval = 60 * 24
            });

            _OWLOSThingConfig.APIQueryIntervals.Add(new APIQueryInterval()
            {
                APIType = APINameType.GetAllScripts,
                Enable = false,
                Interval = 60 * 24
            });

            _OWLOSThingConfig.APIQueryIntervals.Add(new APIQueryInterval()
            {
                APIType = APINameType.GetFeatures,
                Enable = false,
                Interval = 60 * 24
            });

            OWLOSThingWrapper thingWrapper =  thingsManager.CreateThingWrapper(_OWLOSThingConfig);
            if (thingWrapper == null)
            {
                return false;
            }

            //This for AirQuality only code, so add drivers manual
            OWLOSDriver driver = new OWLOSDriver(thingWrapper.Thing, "dht22");
            driver.properties.Add(new OWLOSDriverProperty(driver, "available", "nan", "b"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "temperature", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "temperaturehistorydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "humidity", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "humidityhistorydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "heatindex", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "heatindexhistorydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "celsius", "nan", "rf"));
            thingWrapper.Thing.drivers.Add(driver);

            driver = new OWLOSDriver(thingWrapper.Thing, "bmp280");
            driver.properties.Add(new OWLOSDriverProperty(driver, "available", "nan", "b"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "pressure", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "pressurehistorydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "altitude", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "altitudehistorydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "temperature", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "temperaturehistorydata", "nan", "r"));
            thingWrapper.Thing.drivers.Add(driver);

            driver = new OWLOSDriver(thingWrapper.Thing, "ads1x15");
            driver.properties.Add(new OWLOSDriverProperty(driver, "available", "nan", "b"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_0", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_0_volts", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_0_historydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_1", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_1_volts", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_1_historydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_2", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_2_volts", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_2_historydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_3", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_3_volts", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "chanel_3_historydata", "nan", "r"));
            thingWrapper.Thing.drivers.Add(driver);

            driver = new OWLOSDriver(thingWrapper.Thing, "ccs811");
            driver.properties.Add(new OWLOSDriverProperty(driver, "available", "nan", "b"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "co2", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "co2historydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "tvoc", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "tvochistorydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "resistence", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "resistencehistorydata", "nan", "r"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "temperature", "nan", "rf"));
            driver.properties.Add(new OWLOSDriverProperty(driver, "temperaturehistorydata", "nan", "r"));

            thingWrapper.Thing.drivers.Add(driver);
            return true;
        }

        /// <summary>
        /// Only for internal use, not defined at interface, get all connection with out authorized user
        /// </summary>
        /// <returns></returns>
        public List<ThingConnectionPropertiesDTO> GetAllThingsConnections()
        {
            return _thingsRepository.GetAllThingsConnections();
        }

        /// <summary>
        /// Get thing all drivers properties
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="ThingId"></param>
        /// <returns></returns>
        public List<ThingDriverPropertiesDTO> GetThingAllDriversProperties(Guid UserId, int ThingId)
        {
            List<ThingDriverPropertiesDTO> driversPropertiesDTO = new List<ThingDriverPropertiesDTO>();

            foreach (OWLOSThingWrapper wrapper in thingsManager.OWLOSThingWrappers)
            {
                if ((wrapper.Thing.config.UserId.Equals(UserId)) && (wrapper.Thing.config.ThingId == ThingId))
                {                    
                    foreach(OWLOSDriver driver in wrapper.Thing.drivers)
                    {
                        ThingDriverPropertiesDTO thingDriverPropertiesDTO = new ThingDriverPropertiesDTO
                        {
                            name = driver.name,
                            properties = new List<ThingDriverPropertyDTO>()
                        };
                        driversPropertiesDTO.Add(thingDriverPropertiesDTO);

                        foreach (OWLOSDriverProperty property in driver.properties)
                        {
                            thingDriverPropertiesDTO.properties.Add(new ThingDriverPropertyDTO()
                            {
                                name = property.name,
                                value = property.value
                            });
                        }                            
                    }
                    return driversPropertiesDTO;
                }
            }
            return null;
        }

        #endregion

        #region ThingsThreadManager
        private static ThingsManager thingsManager = null;

        /// <summary>
        /// OWLOS Things Manager threading entry point 
        /// </summary>
        /// <param name="thingsService">dynamic ThengService object pointer</param>
        public static void Start(object thingsService)
        {
            ThingsService _thingsService =  thingsService as ThingsService;
                       
            IMapper _mapper = new Mapper();
            
            List<ThingConnectionPropertiesDTO> connectionsProperties = _thingsService.GetAllThingsConnections();

            //Run all available Things Wrappers 
            foreach(ThingConnectionPropertiesDTO connectionPropertiesDTO in connectionsProperties)
            {
                _thingsService.AddThingToEcosystem(connectionPropertiesDTO);
                //sleep 2 seconds for new thing lifetime query timer 
                Thread.Sleep(10000);
            }
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
                e.ThingWrapper.Thing.OnDataStore += Thing_OnDataStore;
            }
        }

        /// <summary>
        /// Analise and store thing's air quality data to repository
        /// </summary>
        /// <param name="sender">OWLOSThing sender object with air quality data</param>
        private static void Thing_OnDataStore(object sender)
        {            
            _thingsRepository.AddAirQuality((OWLOSThing)sender);
        }
        #endregion
    }
}
