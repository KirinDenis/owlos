using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;

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

    public class OWLOSNode : IOWLOSAbstractTransport
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
                        RESTfulClientTransport _RESTfulClientTransport = new RESTfulClientTransport(this);
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
            lifeCycleTimer = new Timer(10000)
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
            //await GetAllDriversProperties();
            //await GetAllScripts();
        }


        protected virtual void NewDriver(OWLOSDriverWrapperEventArgs e)
        {
            OnNewDriver?.Invoke(this, e);
        }

        public async Task ParseGetAllDriversProperties(string driverData)
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

        public async Task ParseNodePublish(string data)
        {
            data = data.Substring(data.IndexOf(" ") + 1);
            string topic = data.Substring(0, data.IndexOf(" "));
            string value = data.Substring(data.IndexOf(" ") + 1);

            List<string> tokenizeTopic = topic.Split('/').ToList();
            if (tokenizeTopic.Count > 2)
            {
                
                string driverName = tokenizeTopic[tokenizeTopic.Count - 2];
                string property = tokenizeTopic[tokenizeTopic.Count - 1];

                //find driver
                OWLOSDriver driver = drivers.Find(d => d.name == driverName);
                
                if (driver != null)
                {
                    await driver.SetParsedProperty(property, value);
                }//can be ESP drivers
                else
                {
                    driver = drivers.Find(d => d.name == "wifi");
                    if (driver != null)
                    {
                        if (await driver.SetParsedProperty(property, value) != true)
                        {
                            driver = drivers.Find(d => d.name == "network");
                            if (driver != null)
                            {
                                if (await driver.SetParsedProperty(property, value) != true)
                                {
                                    driver = drivers.Find(d => d.name == "esp");
                                    if (driver != null)
                                    {
                                        await driver.SetParsedProperty(property, value);
                                    }
                                }
                            }    
                        }    
                    }
                }

            }

        }

        public void newProp(object sender, EventArgs e)
        {

        }

        public async Task<bool> GetAllDriversProperties()
        {
            bool result = false;
            foreach (IOWLOSTransport _OWLOSTransport in transports)
            {
                result |= await _OWLOSTransport.GetAllDriversProperties();
            }
            return result;
        }

        public async Task<bool> SetDriverProperty(string driver, string property, string value)
        {
            bool result = false;
            foreach (IOWLOSTransport _OWLOSTransport in transports)
            {
                result |= await _OWLOSTransport.SetDriverProperty(driver, property, value);
            }
            return result;

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
