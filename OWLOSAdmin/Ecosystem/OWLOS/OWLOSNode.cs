using OWLOSAdmin.Ecosystem.OWLOSDTOs;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO.Ports;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows.Controls;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    /*

    admin side          |    node side       
                        |
                        |

    */

    public class OWLOSDriverWrapperEventArgs : EventArgs
    {
        public OWLOSDriverWrapperEventArgs(OWLOSDriver driver)
        {
            this.driver = driver;
        }

        public OWLOSDriver driver;
    }


    public class OWLOSNodeConfig
    {
        public List<OWLOSConnection> connections = new List<OWLOSConnection>();
    }

    public class OWLOSNode
    {

        public List<OWLOSDriver> drivers { get; set; } = new List<OWLOSDriver>();

        public delegate void DriverEventHandler(object? sender, OWLOSDriverWrapperEventArgs e);

        public event DriverEventHandler OnNewDriver;

        public Admin admin;

        public List<IOWLOSTransport> transports = new List<IOWLOSTransport>();

        public OWLOSNodeConfig config = null;

        private Timer lifeCycleTimer;

        public OWLOSNode(Admin admin, OWLOSNodeConfig config)
        {
            this.config = config;
            this.admin = admin;

            foreach (OWLOSConnection connection in config.connections)
            {
                switch (connection.connectionType)
                {
                    case ConnectionType.RESTfulClient:
                        RESTfulClientTransport _RESTfulClientTransport = new RESTfulClientTransport();
                        _RESTfulClientTransport.connection = connection;
                        transports.Add(_RESTfulClientTransport);
                        break;
                    case ConnectionType.UART:
                        UARTTransport _UARTTransport = new UARTTransport(this);
                        _UARTTransport.connection = connection;
                        transports.Add(_UARTTransport);
                        break;

                }
            }
            Start();
            //    this.wrapper = wrapper;
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
            foreach (IOWLOSTransport _OWLOSTransport in transports)
            {
                DriversDTO driversDTO = await _OWLOSTransport.GetAllDriversProperties();
                if (driversDTO.error == "")
                {
                    //DTO to Drivers
                }
            }
            //await GetAllDriversProperties();
            //await GetAllScripts();
        }


        protected virtual void NewDriver(OWLOSDriverWrapperEventArgs e)
        {
            OnNewDriver?.Invoke(this, e);
        }

        public async Task parseDrivers(string driverData)
        {
            List<string> driverRaw = driverData.Split('\n').ToList();
            OWLOSDriver driver = null;
            foreach (string driverProp in driverRaw)
            {
                //find driver
                if (driverProp.IndexOf("properties for:") != -1)
                {
                    string driverName = driverProp.Substring(driverProp.IndexOf(":") + 1);
                    driver = drivers.Find(n => n.name == driverName);
                    if (driver == null)
                    {
                        driver = new OWLOSDriver(this, driverName);

                        OWLOSDriverWrapperEventArgs _OWLOSDriverWrapperEventArgs = new OWLOSDriverWrapperEventArgs(driver);

                        NewDriver(_OWLOSDriverWrapperEventArgs);

                        drivers.Add(driver);
                    }
                    else
                    {

                    }
                }
                else
                if (driver != null)
                {
                    if (driverProp.IndexOf("=") != -1)
                    {
                        string key = driverProp.Substring(0, driverProp.IndexOf("="));
                        string value = driverProp.Substring(driverProp.IndexOf("=") + 1);
                        await driver.SetParsedProperty(key, value);
                    }
                }
            }
        }

        public async Task parseScripts(string scriptData)
        {

        }



        public void newProp(object sender, EventArgs e)
        {

        }

        /*
        public void AddDriver()
        {
            dynamic driver = new OWLOSDriver("test");
            (driver as OWLOSDriver).NewProperty += newProp;
            driver.id = 20;
            driver.id += 50;
            //  driver.set();
          //  driver.SetMember("topic", "node/kitchen");
            String a = driver.topic;
            driver.topic = "1234";
            //driver(2, 3);
            String b = a + driver.topic;


            /*
                SerialPort mySerialPort = new SerialPort("COM7");

                mySerialPort.BaudRate = 115200;
                mySerialPort.Parity = Parity.None;
                mySerialPort.StopBits = StopBits.One;
                mySerialPort.DataBits = 8;
                //mySerialPort.Handshake = Handshake.None;
               // mySerialPort.RtsEnable = true;

                mySerialPort.DataReceived += new SerialDataReceivedEventHandler(DataReceivedHandler);

                mySerialPort.Open();

                Console.WriteLine("Press any key to continue...");
                Console.WriteLine();
            

            //  mySerialPort.Close();


        }


        private void DataReceivedHandler(
                                object sender,
                                SerialDataReceivedEventArgs e)
        {
            SerialPort sp = (SerialPort)sender;
            string indata = sp.ReadExisting();
            Console.WriteLine("Data Received:");
            Console.Write(indata);
        }
    */

    }
}
