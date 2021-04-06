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
using System.Net.Http;
using System.Threading.Tasks;
using System.Timers;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{

    public class TransportType
    {
        public const int HttpClient = 0x0001;
        public const int MQTTClient = 0x0002;
        public const int UART = 0x0004;
    }

    public class OWLOSTransportOLD
    {
        private readonly OWLOSThing Thing = null;
        public string RESTfulServerHost = "";
        public int RESTfulServerPort = 80;
        private Timer lifeCycleTimer;


        public OWLOSTransportOLD(OWLOSThing Thing)
        {
            this.Thing = Thing;
        }
        public void Start()
        {
            lifeCycleTimer = new Timer(1000)
            {
                AutoReset = true
            };
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();
            OnLifeCycleTimer(null, null);

        }

        private async void OnLifeCycleTimer(object source, ElapsedEventArgs e)
        {
            await GetAllDriversProperties();
            await GetAllScripts();
        }

        public async Task<string> Get(string APIName, string args = "")
        {
            try
            {
                HttpClient client = new HttpClient();
                HttpResponseMessage response = await client.GetAsync(RESTfulServerHost + APIName + args);

                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception exception)
            {
                return "Error:" + exception.Message;
            }
        }

        
        public async Task<bool> GetAllScripts()
        {
            string driverPoperties = await Get("getallscripts");
            if (driverPoperties.IndexOf("Error:") != 0)
            {
                try
                {
                 //   await Thing.parseDrivers(driverPoperties);
                    return true;
                }
                catch { }
            }
            return false;
        }


        public async Task<bool> GetAllDriversProperties()
        {
            string driverPoperties = await Get("getalldriversproperties");
            if (driverPoperties.IndexOf("Error:") != 0)
            {
                try
                {
                   // await Thing.parseDrivers(driverPoperties);
                    return true;
                }
                catch { }
            }
            return false;
        }

        public async Task<string> GetDriverProperty(string driverName, string propertyName)
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(RESTfulServerHost + "getdriverproperty?id=" + driverName + "&property=" + propertyName);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> SetDriverProperty(string driverName, string propertyName, string propertyValue)
        {
            try
            {
                HttpClient client = new HttpClient();
                HttpResponseMessage response = await client.GetAsync(RESTfulServerHost + "setdriverproperty?id=" + driverName + "&property=" + propertyName + "&value=" + propertyValue);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception exception)
            {
                return "Error:" + exception.Message;
            }

        }

    }
}
