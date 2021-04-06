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

using System;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{
    public enum ConnectionType { RESTfulClient, MQTT, UART }

    public enum APINameType { GetAllDriverProperties, GetAllFiles, GetAllScripts}

    public class APIQueryInterval
    {
        public bool Enable { get; set; } = true;        
        public APINameType APIType { get; set; }
        public uint Interval { get; set; }
        public DateTime LastCall { get; set; }
    }

    internal interface IOWLOSConnection
    {
        bool enable { get; set; }

        string name { get; set; }

        ConnectionType connectionType { get; set; }

        string connectionString { get; set; }

    }
    public class OWLOSConnection : IOWLOSConnection
    {
        public bool enable { get; set; } = true;

        public uint Priority = 0;

        public string name { get; set; }

        public ConnectionType connectionType { get; set; }

        public string connectionString { get; set; }

    }
}
