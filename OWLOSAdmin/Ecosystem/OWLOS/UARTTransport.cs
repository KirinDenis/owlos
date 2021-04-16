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
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Threading.Tasks;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{

    public class UARTClientConnectionDTO
    {
        public string port;

        public int baudRate;

        public Parity parity;

        public StopBits stopBits;

        public int dataBits;

        public Handshake handshake;

        public bool RTSEnable;
    }


    public class UARTTransport : OWLOSTransport
    {
        protected OWLOSConnection _connection = null;

        protected UARTClientConnectionDTO _UARTClientConnectionDTO;

        protected SerialPort serialPort;
        public override OWLOSConnection connection
        {
            get => _connection;
            set
            {
                _connection = value;
                _UARTClientConnectionDTO = JsonConvert.DeserializeObject<UARTClientConnectionDTO>(_connection.connectionString);

                if (serialPort == null)
                {
                    serialPort = new SerialPort(_UARTClientConnectionDTO.port);
                }
                else
                {
                    if (serialPort.IsOpen)
                    {
                        serialPort.DiscardInBuffer();
                        serialPort.DiscardOutBuffer();
                    }
                    serialPort.Close();
                    serialPort.Dispose();
                    serialPort = null;
                    serialPort = new SerialPort(_UARTClientConnectionDTO.port);

                }

                serialPort.BaudRate = _UARTClientConnectionDTO.baudRate;
                serialPort.Parity = _UARTClientConnectionDTO.parity;
                serialPort.StopBits = _UARTClientConnectionDTO.stopBits;
                serialPort.DataBits = _UARTClientConnectionDTO.dataBits;
                serialPort.Handshake = _UARTClientConnectionDTO.handshake;
                serialPort.RtsEnable = _UARTClientConnectionDTO.RTSEnable;

                serialPort.DataReceived += new SerialDataReceivedEventHandler(DataReceivedHandler);
                OpenPort();

            }
        }

        private readonly bool once = false;


        private readonly OWLOSThing Thing;
        private string indata = "";

        public UARTTransport(OWLOSThing Thing)
        {

            this.Thing = Thing;
        }

        private bool OpenPort()
        {
            
            networkStatus = NetworkStatus.Reconnect;
            if (serialPort == null)
            {
                networkStatus = NetworkStatus.Erorr;
                return false;
            }

            if (!serialPort.IsOpen)
            {
                try
                {

                    serialPort.Open();
                    networkStatus = NetworkStatus.Online;
                }
                catch (Exception exception)
                {
                    networkStatus = NetworkStatus.Offline;
                    AddToLog(new LogItem()
                    {
                        dateTime = DateTime.Now,
                        isSend = true,
                        networkStatus = _networkStatus,
                        size = 0,
                        text = exception.Message

                    }); ;
                    return false;
                }
            }
            return true;

        }
        

        public override async Task<bool> GetAllDriversProperties()
        {            
            networkStatus = NetworkStatus.Reconnect;
            RESTfulClientResultModel getResult = await Get("AT+ADP?");
            if (string.IsNullOrEmpty(getResult.error))
            {
                return true;
            }
            else
            {
                return false;
            }            
        }

        public override async Task<bool> GetAllFiles()
        {
            networkStatus = NetworkStatus.Reconnect;
            RESTfulClientResultModel getResult = await Get("AT+FL?");
            if (string.IsNullOrEmpty(getResult.error))
            {
                return true;
            }
            else
            {
                return false;
            }
        }


        public override async Task<bool> SetDriverProperty(string driver, string property, string value)
        {
            networkStatus = NetworkStatus.Reconnect;
            RESTfulClientResultModel getResult = await Get("AT+DP " + driver + " " + property + " " + value);
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
            //  if ((_connection == null) || (string.IsNullOrEmpty(_UARTClientConnectionDTO.port)))
            if ((_connection == null))
            {
                return result;
            }

            if (!_connection.enable)
            {
                networkStatus = NetworkStatus.Offline;
                if (serialPort.IsOpen)
                {
                    serialPort.Close();
                }
                result.error = "Transport is disable on high level";
                return result;
            }

            try
            {
                if (OpenPort())
                {

                    serialPort.WriteLine(APIName + "\n\r");
                    totlaSend += APIName.Length + 2;
                    AddToLog(new LogItem()
                    {
                        dateTime = DateTime.Now,
                        isSend = true,
                        networkStatus = NetworkStatus.Online,
                        size = APIName.Length,
                        text = APIName
                    });

                    result.error = string.Empty;
                    return result;
                }
                else
                {
                    result.error = "can't open port";
                }

            }
            catch (Exception exception)
            {
                result.error = exception.Message;
            }

            return result;
        }

        private void DataReceivedHandler(object sender, SerialDataReceivedEventArgs e)
        {
            networkStatus = NetworkStatus.Online;
            SerialPort sp = (SerialPort)sender;
            indata += sp.ReadExisting();
            totlaRecv += indata.Length;

            if (_connection.enable)
            {
                //clean echo 
                while (indata.IndexOf("\r\n") != -1)
                {
                    indata = indata.Substring(indata.IndexOf("\r\n") + 2);
                }

                if (indata.IndexOf("\n\n") != -1)
                {

                    AddToLog(new LogItem()
                    {
                        dateTime = DateTime.Now,
                        isSend = false,
                        networkStatus = NetworkStatus.Online,
                        size = indata.Length,
                        text = indata
                    });

                    while (indata.IndexOf("\n\n") != -1)
                    {
                        string _data = indata.Substring(0, indata.IndexOf("\n\n") + 2);
                        indata = indata.Substring(indata.IndexOf("\n\n") + 2);
                        List<string> serialRaw = _data.Split('\n').ToList();


                        int i = 0;
                        while (i < serialRaw.Count)
                        {
                            string data = serialRaw[i];
                            if (data.IndexOf("OK: ") == 0)
                            {
                                string APIName = data.Substring(4);
                                string APIData = string.Empty;

                                i++;

                                while ((i < serialRaw.Count - 1) && (!(string.IsNullOrEmpty(serialRaw[i]) && string.IsNullOrEmpty(serialRaw[i + 1]))))
                                {
                                    APIData += serialRaw[i] + "\n";
                                    i++;
                                }

                                if (APIName.ToUpper().IndexOf("AT+ADP?") == 0)
                                {
                                    Task task = Thing.ParseGetAllDriversProperties(APIData);
                                    //    Thing.parseDrivers(APIData);
                                }
                            }

                            if (data.IndexOf("PUB: ") == 0)
                            {
                                Task task = Thing.ParseThingPublish(data);
                            }

                            i++;
                        }
                    }

                }
            }

        }
    }
}
