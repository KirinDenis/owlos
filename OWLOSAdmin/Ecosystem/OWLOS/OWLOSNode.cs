using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO.Ports;
using System.Linq;
using System.Net.Http;
using System.Text;
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
        public OWLOSDriver driver;
    }



    public class OWLOSNode
    {
        
        public List<OWLOSDriver> drivers { get; set; } = new List<OWLOSDriver>();

        public delegate void DriverEventHandler(object? sender, OWLOSDriverWrapperEventArgs e);

        public event DriverEventHandler NewDriver;

        
        public OWLOSNode()
        {

        }


        protected virtual void OnNewDriver(OWLOSDriverWrapperEventArgs e)
        {
            NewDriver?.Invoke(this, e);
        }

        public void parseDrivers(string driverData)
        {
            List<string> driverRaw = driverData.Split('\n').ToList();
            OWLOSDriver driver = null;
            foreach (string driverProp in driverRaw)
            {
                //find driver
                if (driverProp.IndexOf(":") != -1)
                {
                    string driverName = driverProp.Substring(driverProp.IndexOf(":") + 1);
                    driver = drivers.Find(n => n.name == driverName);
                    if (driver == null)
                    {
                        driver = new OWLOSDriver(this, driverName);
                        
                        OWLOSDriverWrapperEventArgs _OWLOSDriverWrapperEventArgs = new OWLOSDriverWrapperEventArgs();
                        _OWLOSDriverWrapperEventArgs.driver = driver;
                        OnNewDriver(_OWLOSDriverWrapperEventArgs);
                    }
                }
                else
                if (driver != null)
                {
                    drivers.Add(driver);
                    if (driverProp.IndexOf("=") != -1)
                    {
                        string key = driverProp.Substring(0, driverProp.IndexOf("="));
                        string value = driverProp.Substring(driverProp.IndexOf("=") + 1);
                        driver.SetParsedProperty(key, value);
                    }
                }
            }
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
