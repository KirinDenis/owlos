/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
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

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{
    public interface IOWLOSAbstractTransport
    {
        abstract public Task<bool> GetFeatures();
        abstract public Task<bool> GetAllDriversProperties();
        abstract public Task<bool> SetDriverProperty(string driver, string property, string value);
        abstract public Task<string> GetDriverProperty(string driver, string property);
        abstract public Task<bool> GetAllFiles();
        abstract public Task<bool> DownloadFile(string fileName);
        abstract public Task<bool> DeleteFile(string fileName);

    }

    public class LogItem
    {
        public DateTime dateTime;

        public bool isSend;

        public string text;

        public NetworkStatus networkStatus;

        public int size;        
    }
    public interface IOWLOSTransport : IOWLOSAbstractTransport
    {
        public object tag { get; set; }
        public long totlaSend { get; set; }
        public long totlaRecv { get; set; }
        public List<LogItem> logItems { get; }
        public OWLOSConnection connection { get; set; }        
        
        public void AddToLog(LogItem logItem);

        delegate void TransportEventHandler(object sender, NetworkStatus e);

        delegate void LogEventHandler(object sender, LogItem e);

        event TransportEventHandler OnTransportStatusChanger;

        event LogEventHandler OnLogItem;
    }
}
