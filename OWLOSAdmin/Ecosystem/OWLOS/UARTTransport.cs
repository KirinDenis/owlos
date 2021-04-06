﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
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

        private bool once = false;


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
            AddToLog(new LogItem()
            {
                dateTime = DateTime.Now,
                isSend = false,
                networkStatus = NetworkStatus.Online,
                size = indata.Length,
                text = indata
            });


            //clean echo 
            while (indata.IndexOf("\r\n") != -1)
            {
                indata = indata.Substring(indata.IndexOf("\r\n") + 2);
            }

            if (indata.IndexOf("\n\n") != -1)
            {
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

                            if (APIName.ToUpper().Equals("AT+ADP?"))
                            {
                               Task task = Thing.ParseGetAllDriversProperties(APIData);
                             //    Thing.parseDrivers(APIData);
                            }
                        }

                        if (data.IndexOf("PUB: ") == 0 )
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
