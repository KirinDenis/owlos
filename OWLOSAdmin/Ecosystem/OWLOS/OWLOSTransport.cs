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
    public enum NetworkStatus
    {
        Offline = 0,
        Online,
        Reconnect,
        Erorr
    }

    public class OWLOSTransportArgs : EventArgs
    {
        public OWLOSTransportArgs(NetworkStatus networkStatus)
        {
            this.networkStatus = networkStatus;
        }

        public NetworkStatus networkStatus;
    }


    public class OWLOSTransport : IOWLOSTransport
    {
        protected NetworkStatus _networkStatus = NetworkStatus.Offline;
        public NetworkStatus networkStatus
        {
            get => _networkStatus;
            set
            {
                _networkStatus = value;
                OnTransportStatusChanger?.Invoke(this, value);

                if ((_networkStatus == NetworkStatus.Offline))
                {
                    AddToLog(new LogItem()
                    {
                        dateTime = DateTime.Now,
                        isSend = false,
                        networkStatus = _networkStatus,
                        size = 0
                    });
                }

            }
        }

        
        public event IOWLOSTransport.TransportEventHandler OnTransportStatusChanger;

        public event IOWLOSTransport.LogEventHandler OnLogItem;


        public virtual OWLOSConnection connection { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public object tag { get; set; }
        public long totlaSend { get; set; }
        public long totlaRecv { get; set; }
        public List<LogItem> logItems { get; } = new List<LogItem>();

        public virtual async Task<bool> GetFeatures()
        {
            throw new NotImplementedException();
        }
        public virtual async Task<bool> GetAllDriversProperties()
        {
            throw new NotImplementedException();
        }
        public virtual async Task<bool> SetDriverProperty(string driver, string property, string value)
        {
            throw new NotImplementedException();
        }
        public virtual async Task<string> GetDriverProperty(string driver, string property)
        {
            throw new NotImplementedException();
        }
        public virtual async Task<bool> GetAllFiles()
        {
            throw new NotImplementedException();
        }
        public Task<bool> DownloadFile(string fileName)
        {
            throw new NotImplementedException();
        }
        public virtual async Task<bool> DeleteFile(string fileName)
        {
            throw new NotImplementedException();
        }

        public void AddToLog(LogItem logItem)
        {
            if (logItems.Count > 1000)
            {
                logItems.Clear();
                System.GC.Collect();
            }

            logItems.Add(logItem);
            OnLogItem?.Invoke(this, logItem);
        }
    }
}
