/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

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

(Этот файл — часть Ready IoT Solution - OWLOS.

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

using Newtonsoft.Json;
using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.IO.Ports;


namespace OWLOSAdmin.Ecosystem
{
    public class OWLOSThingWrapper
    {
        public Admin CurrentAdmin;
        public OWLOSThingWrapper(Admin CurrentAdmin)
        {
            this.CurrentAdmin = CurrentAdmin;
        }
        public OWLOSTransportOLD transport;
        public OWLOSThing Thing = null;
        public string RESTfulServerHost = string.Empty;
        public Point explorerPosition;
    }

    public class OWLOSThingWrapperEventArgs : EventArgs
    {
        public OWLOSThingWrapper ThingWrapper;
        public OWLOSThingWrapperEventArgs(OWLOSThingWrapper ThingWrapper)
        {
            this.ThingWrapper = ThingWrapper;
        }
    }

    public class AdminConfig
    {
        public List<OWLOSThingConfig> ThingsConfig = new List<OWLOSThingConfig>();
    }
    public class Admin
    {

        public List<OWLOSThingWrapper> OWLOSThingWrappers = new List<OWLOSThingWrapper>();

        public delegate void NewThingEventHandler(object? sender, OWLOSThingWrapperEventArgs e);
        public event NewThingEventHandler OnNewThing;

        public AdminConfig config = new AdminConfig();

        public event EventHandler OnDeleteThingWrapper;

        public Admin()
        {
        }

        public void Load()
        {
            if (File.Exists("config.json"))
            {
                string JSONConfig = File.ReadAllText("config.json");
                config = JsonConvert.DeserializeObject<AdminConfig>(JSONConfig);
            }
            else //reset config
            {
                CreateThingConnection();
            }
            //Save each time before development - add new fields to JSON
            Save();
            foreach (OWLOSThingConfig _OWLOSThingConfig in config.ThingsConfig)
            {
                OWLOSThingWrapper ThingWrapper = new OWLOSThingWrapper(this)
                {
                    Thing = new OWLOSThing(_OWLOSThingConfig)
                };
                OWLOSThingWrappers.Add(ThingWrapper);
                NewThing(new OWLOSThingWrapperEventArgs(ThingWrapper));
            }
        }

        public void Save()
        {
            string JSONConfig = JsonConvert.SerializeObject(config, Formatting.Indented);
            File.WriteAllText("config.json", JSONConfig);
        }


        public OWLOSThingConfig CreateThingConnection()
        {
            OWLOSThingConfig _OWLOSThingConfig = new OWLOSThingConfig
            {
                Name = "OWLOS Thing"
            };

            OWLOSConnection _RESTfulClientConnection = new OWLOSConnection
            {
                connectionType = ConnectionType.RESTfulClient,
                name = "rest"
            };

            RESTfulClientConnectionDTO _RESTfulClientConnectionDTO = new RESTfulClientConnectionDTO
            {
                host = "http://192.168.1.101:80/"
            };
            // _RESTfulClientConnectionDTO.port = 80;
            _RESTfulClientConnection.connectionString = JsonConvert.SerializeObject(_RESTfulClientConnectionDTO);

            _OWLOSThingConfig.connections.Add(_RESTfulClientConnection);

            OWLOSConnection _UARTClientConnection = new OWLOSConnection();
            _UARTClientConnection = new OWLOSConnection
            {
                connectionType = ConnectionType.UART,
                name = "UART"
            };
            UARTClientConnectionDTO _UARTClientConnectionDTO = new UARTClientConnectionDTO
            {
                port = "COM7",
                baudRate = 115200,
                parity = Parity.None,
                stopBits = StopBits.One,
                dataBits = 8,
                handshake = Handshake.None,
                RTSEnable = false
            };
            _UARTClientConnection.connectionString = JsonConvert.SerializeObject(_UARTClientConnectionDTO);

            _OWLOSThingConfig.connections.Add(_UARTClientConnection);

            _OWLOSThingConfig.APIQueryIntervals = new List<APIQueryInterval>() {
            new APIQueryInterval()
            {
                APIType = APINameType.GetAllDriverProperties,
                Interval = 1
            },
            new APIQueryInterval()
            {
                APIType = APINameType.GetAllFiles,
                Interval = 10
            },
            new APIQueryInterval()
            {
                APIType = APINameType.GetAllScripts,
                Interval = 20
            }
            };

            config.ThingsConfig.Add(_OWLOSThingConfig);

            return _OWLOSThingConfig;

        }

        public OWLOSThingWrapper CreateThingWrapper()
        {
            OWLOSThingConfig _OWLOSThingConfig = CreateThingConnection();

            OWLOSThingWrapper ThingWrapper = new OWLOSThingWrapper(this)
            {
                Thing = new OWLOSThing(_OWLOSThingConfig)
            };
            OWLOSThingWrappers.Add(ThingWrapper);
            NewThing(new OWLOSThingWrapperEventArgs(ThingWrapper));

            return ThingWrapper;
        }

        public bool DeleteThingWrapper(OWLOSThingWrapper ThingWrapper)
        {
            foreach (OWLOSConnection connection in ThingWrapper.Thing.config.connections)
            {
                connection.enable = false;
            }

            config.ThingsConfig.Remove(ThingWrapper.Thing.config);
            OWLOSThingWrappers.Remove(ThingWrapper);

            OnDeleteThingWrapper?.Invoke(ThingWrapper, new EventArgs());

            return true;
        }

        protected virtual void NewThing(OWLOSThingWrapperEventArgs e)
        {
            OnNewThing?.Invoke(this, e);
        }

    }
}
