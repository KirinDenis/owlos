using OWLOSAdmin.Ecosystem.OWLOSDTOs;
using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public class UARTTransport : OWLOSTransport
    {
        protected OWLOSConnection _connection = null;
        override public OWLOSConnection connection { get => _connection; set { _connection = value as OWLOSConnection; } }

        private bool once = false;

        private SerialPort mySerialPort;

        private OWLOSNode node;

        string indata = "";

        public UARTTransport(OWLOSNode node)
        {

            this.node = node;
            //mySerialPort = new SerialPort(_connection.host);
            mySerialPort = new SerialPort("COM7");

            mySerialPort.BaudRate = 115200;
            mySerialPort.Parity = Parity.None;
            mySerialPort.StopBits = StopBits.One;
            mySerialPort.DataBits = 8;
            mySerialPort.Handshake = Handshake.None;
            //mySerialPort.RtsEnable = true;

            mySerialPort.DataReceived += new SerialDataReceivedEventHandler(DataReceivedHandler);

            mySerialPort.Open();

        }

        override public async Task<DriversDTO> GetAllDriversProperties()
        {
            DriversDTO driversDTO = new DriversDTO();

            RESTfulClientResultModel getResult = await Get("AT+ADP?");
            if (string.IsNullOrEmpty(getResult.error))
            {
                driversDTO = base.GetAllDriversProperties(getResult.result);
            }
            else
            {
                driversDTO.error = getResult.error;
            }

            return driversDTO;
        }

        protected async Task<RESTfulClientResultModel> Get(string APIName, string args = "")
        {


            RESTfulClientResultModel result = new RESTfulClientResultModel();
            // if (once) return result;
            once = true;

            if ((_connection == null) || (string.IsNullOrEmpty(_connection.host)))
            {
                return result;
            }

            try
            {

                if (mySerialPort.IsOpen)
                {
                    mySerialPort.WriteLine(APIName + "\n\r");
                }



            }
            catch (Exception exception)
            {
                result.error = exception.Message;
            }

            return result;
        }

        public DriversDTO GetAllDriversProperties(string data)
        {
            return base.GetAllDriversProperties(data);
        }

        private void DataReceivedHandler(object sender, SerialDataReceivedEventArgs e)
        {
            SerialPort sp = (SerialPort)sender;
            indata += sp.ReadExisting();

            if (indata.IndexOf("\n\n") != -1)
            {
                List<string> serialRaw = indata.Split('\n').ToList();
                indata = "";

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

                            //DriversDTO drivers = base.GetAllDriversProperties(APIData);
                            node.parseDrivers(APIData);
                        }
                    }
                    i++;
                }
            }
        }


    }
}
