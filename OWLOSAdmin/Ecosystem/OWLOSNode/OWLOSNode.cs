using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO.Ports;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Timers;
using System.Windows.Controls;

namespace OWLOSAdmin.Ecosystem.OWLOSNode
{
    /*

    admin side          |    node side       
                        |
                        |




    */



    public class OWLOSNode
    {
        public OWLOSTransport transport = new OWLOSTransport();
        public List<OWLOSDriver> drivers { get; set; } = new List<OWLOSDriver>();

        private Timer lifeCycleTimer;
        public OWLOSNode()
        {

            lifeCycleTimer = new Timer(100000);
            lifeCycleTimer.AutoReset = true;
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();
            OnLifeCycleTimer(null, null);
        }

        private async void OnLifeCycleTimer(Object source, ElapsedEventArgs e)
        {
            string driverPoperties = await transport.HTTPGet("getalldriversproperties");
            if (driverPoperties.IndexOf("Error:") != 0)
            {
                parseDrivers(driverPoperties);
            }
        }



        private void parseDrivers(string driverData)
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
                        driver = new OWLOSDriver(driverName);
                        drivers.Add(driver);
                    }
                }
                else
                if (driver != null)
                {
                    if (driverProp.IndexOf("=") != -1)
                    {
                        string key = driverProp.Substring(0, driverProp.IndexOf("="));
                        string value = driverProp.Substring(driverProp.IndexOf("=") + 1);
                        driver.SetParsedProperty(key, value);

                        /*
                        var expandoDict = driver as IDictionary<string, object>;
                        if (expandoDict.ContainsKey(key))
                            expandoDict[key] = value;
                        else
                            expandoDict.Add(key, value);
                        */
                    }
                }
            }
            dynamic _driver = drivers[0];
            _driver.id.value = "1";
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
