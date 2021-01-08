using Newtonsoft.Json;
using OWLOSAdmin.Ecosystem.OWLOSDTOs;
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


        private readonly OWLOSNode node;
        private string indata = "";

        public UARTTransport(OWLOSNode node)
        {

            this.node = node;
        }

        private bool OpenPort()
        {
            
            networkStatus = NetworkStatus.Offline;
            if (serialPort == null)
            {
                return false;
            }

            if (!serialPort.IsOpen)
            {
                try
                {

                    serialPort.Open();
                    networkStatus = NetworkStatus.Online;
                }
                catch
                {
                    networkStatus = NetworkStatus.Erorr;
                    return false;
                }
            }
            return true;

        }

        public override async Task<DriversDTO> GetAllDriversProperties()
        {
            DriversDTO driversDTO = new DriversDTO();

            networkStatus = NetworkStatus.Reconnect;
            RESTfulClientResultModel getResult = await Get("AT+ADP?");
            if (string.IsNullOrEmpty(getResult.error))
            {
                //   driversDTO = base.GetAllDriversProperties(getResult.result);
            }
            else
            {
                //  driversDTO.error = getResult.error;
            }

            return driversDTO;
        }

        protected async Task<RESTfulClientResultModel> Get(string APIName, string args = "")
        {


            RESTfulClientResultModel result = new RESTfulClientResultModel();
            //  if ((_connection == null) || (string.IsNullOrEmpty(_UARTClientConnectionDTO.port)))
            if ((_connection == null))
            {
                return result;
            }

            try
            {
                if (OpenPort())
                {

                    serialPort.WriteLine(APIName + "\n\r");
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

        public override DriversDTO GetAllDriversProperties(string data)
        {
            return base.GetAllDriversProperties(data);
        }

        private void DataReceivedHandler(object sender, SerialDataReceivedEventArgs e)
        {
            networkStatus = NetworkStatus.Online;
            SerialPort sp = (SerialPort)sender;
            indata += sp.ReadExisting();


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
                               Task task = node.parseDrivers(APIData);
                             //    node.parseDrivers(APIData);
                            }
                        }
                        i++;
                    }
                }

            }

        }
    }
}
