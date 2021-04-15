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
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{
    public class RESTfulClientResultModel
    {
        public string result = string.Empty;
        public string error = "wrong client initialization";
    }

    public class RESTfulClientConnectionDTO
    {
        public string host;
    }

    public class RESTfulClientTransport : OWLOSTransport
    {
        protected OWLOSConnection _connection = null;

        public RESTfulClientConnectionDTO _RESTfulClientConnectionDTO;
        override public OWLOSConnection connection 
        { 
            get => _connection; 
            set 
            { 
                _connection = value as OWLOSConnection;
                _RESTfulClientConnectionDTO = JsonConvert.DeserializeObject<RESTfulClientConnectionDTO>(_connection.connectionString);
            } 
        }

        private OWLOSThing Thing = null;
        public RESTfulClientTransport(OWLOSThing Thing)
        {
            this.Thing = Thing;
        }
        override public async Task<bool> GetAllDriversProperties()
        {
            RESTfulClientResultModel getResult = await Get("getalldriversproperties");
            if (string.IsNullOrEmpty(getResult.error))
            {                
                await Thing.ParseGetAllDriversProperties(getResult.result);
                return true;
            }
            else
            {
                return false;
            }            
        }
        public override async Task<bool> SetDriverProperty(string driver, string property, string value)
        {
            RESTfulClientResultModel getResult = await Get("setdriverproperty?id=" + driver + "&property=" + property + "&value=" + value);

            if (string.IsNullOrEmpty(getResult.error))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public override async Task<string> GetDriverProperty(string driver, string property)
        {
            RESTfulClientResultModel getResult = await Get("getdriverproperty?id=" + driver + "&property=" + property);

            if (string.IsNullOrEmpty(getResult.error))
            {
                return getResult.result;
            }
            else
            {
                return "%error";
            }
        }
        override public async Task<bool> GetAllFiles()
        {
            RESTfulClientResultModel getResult = await Get("getfilelist?path=");
            if (string.IsNullOrEmpty(getResult.error))
            {
                await Thing.files.ParseGetAllFiles( getResult.result);
                return true;
            }
            else
            {
                return false;
            }
        }
        public override async Task<bool> DeleteFile(string fileName)
        {
            RESTfulClientResultModel getResult = await Get("deletefile?name=" + fileName);

            if (string.IsNullOrEmpty(getResult.error))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        protected async Task<RESTfulClientResultModel> Get(string APIName, string args = "")
        {            
            RESTfulClientResultModel result = new RESTfulClientResultModel();
            if (!connection.enable)
            {
                networkStatus = NetworkStatus.Offline;
                result.error = "RESTful disable";
                return result;
            }

            networkStatus = NetworkStatus.Reconnect;

            if ((_connection == null) || (string.IsNullOrEmpty(_RESTfulClientConnectionDTO.host)))
            {
                networkStatus = NetworkStatus.Offline;
                return result;
            }    

            try
            {
                HttpClient client = new HttpClient();
                
                string queryString = _RESTfulClientConnectionDTO.host + APIName + args;

                totlaSend += queryString.Length;
                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = true,
                    networkStatus = NetworkStatus.Reconnect,
                    size = queryString.Length,                    
                    text = queryString
                });



                HttpResponseMessage response = await client.GetAsync(queryString);

                response.EnsureSuccessStatusCode();
                result.result = await response.Content.ReadAsStringAsync();

                totlaRecv += result.result.Length;

                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = false,
                    networkStatus = NetworkStatus.Reconnect,                    
                    size = result.result.Length,
                    text = result.result
                });


                result.error = string.Empty;
                networkStatus = NetworkStatus.Online;
            }
            catch (Exception exception)
            {
                networkStatus = NetworkStatus.Erorr;
                result.error = exception.Message;

                AddToLog(new LogItem()
                {
                    dateTime = DateTime.Now,
                    isSend = true,
                    networkStatus = _networkStatus,
                    size = 0,
                    text = exception.Message

                }); ;

            }

            return result;
        }

    }
}
