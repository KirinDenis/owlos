﻿/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{

    public class OWLOSDriverWrapperEventArgs : EventArgs
    {
        public OWLOSDriverWrapperEventArgs(OWLOSDriver driver)
        {
            this.driver = driver;
        }

        public OWLOSDriver driver;
    }

    public class OWLOSThingConfig
    {
        public string Name;

        public int ThingId;

        public Guid UserId;

        public DateTime LastConnected;

        public List<OWLOSConnection> connections = new List<OWLOSConnection>();
        public List<APIQueryInterval> APIQueryIntervals { get; set; } = new List<APIQueryInterval>();
    }

    public class OWLOSThing : IOWLOSAbstractTransport
    {
        public string Name;

        public OWLOSFeatures Features = new OWLOSFeatures();
        public List<OWLOSDriver> drivers { get; set; } = new List<OWLOSDriver>();
        public OWLOSFiles files { get; set; }

        public delegate void DriverEventHandler(object sender, OWLOSDriverWrapperEventArgs e);

        public event DriverEventHandler OnNewDriver;

        public List<IOWLOSTransport> transports = new List<IOWLOSTransport>();

        public OWLOSThingConfig config = null;

        private Timer lifeCycleTimer;

        public readonly RESTfulClientTransport _RESTfulClientTransport;

        public readonly UARTTransport _UARTTransport;

        //AirQuality global network status and timings 

        //Global thing network status 
        public NetworkStatus networkStatus = NetworkStatus.Offline;
        //Last session time (current time and offline when create
        public DateTime? lastSessionTime = null;
        //Thing tick count when last session 
        public long? thingTickCount = null;

        //FOR DEBUG
        public object lastAirQulityRecievedData = null;

        //Time last outside store data 
        public DateTime lastDataStoreTime = DateTime.Now;

        public delegate void DataStoreEventHandler(object sender);
        public event DataStoreEventHandler OnDataStore;

        public OWLOSThing(OWLOSThingConfig config)
        {
            this.config = config;

            Name = config.Name;

            files = new OWLOSFiles(this);

            foreach (OWLOSConnection connection in config.connections)
            {
                switch (connection.connectionType)
                {
                    case ConnectionType.RESTfulClient:
                        _RESTfulClientTransport = new RESTfulClientTransport(this)
                        {
                            connection = connection
                        };
                        transports.Add(_RESTfulClientTransport);
                        break;
                    case ConnectionType.MQTT:
                        //TODO:
                        break;
                    case ConnectionType.UART:
                        _UARTTransport = new UARTTransport(this)
                        {
                            connection = connection
                        };
                        transports.Add(_UARTTransport);
                        break;
                }
            }

            //Sort connection by priority
            for (int i = 0; i < transports.Count; i++)
            {
                for (int j = 0; j < transports.Count - 1; j++)
                {
                    if (transports[j].connection.Priority > transports[j + 1].connection.Priority)
                    {
                        IOWLOSTransport exchangeTransport = transports[j];
                        transports[j] = transports[j + 1];
                        transports[j + 1] = exchangeTransport;
                    }
                }
            }


            Start();
            //    this.wrapper = wrapper;
        }

        public async void Start()
        {
            await GetFeatures();

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
            if((DateTime.Now - lastDataStoreTime).TotalSeconds > 5)
            {
                lastDataStoreTime = DateTime.Now;
                DataStore();
            }

            foreach (APIQueryInterval QueryInterval in config.APIQueryIntervals)
            {
                if (!QueryInterval.Enable)
                {
                    continue;
                }
                if ((DateTime.Now - QueryInterval.LastCall).TotalSeconds > QueryInterval.Interval)
                {
                    QueryInterval.LastCall = DateTime.Now;
                    switch (QueryInterval.APIType)
                    {
                        case APINameType.GetFeatures:
                            await GetFeatures();
                            break;
                        case APINameType.GetAllDriverProperties:
                            await GetAllDriversProperties();
                            break;
                        case APINameType.GetAllFiles:
                            await GetAllFiles();
                            break;
                    }
                }
            }
        }

        protected virtual void DataStore()
        {
            OnDataStore?.Invoke(this);
        }


        protected virtual void NewDriver(OWLOSDriverWrapperEventArgs e)
        {
            OnNewDriver?.Invoke(this, e);
        }

        public async Task ParseGetFeatures(string featuresSource)
        {
            await Features.ParseFeatures(featuresSource);
        }

        public async Task ParseGetAllDriversProperties(string driverData)
        {
            List<string> driverRaw = driverData.Split('\n').ToList();
            OWLOSDriver driver = null;
            foreach (string driverProp in driverRaw)
            {
                //find driver
                if ((driverProp.IndexOf("properties for:") != -1) || (driverProp.IndexOf("PF:") != -1))
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

        public async Task ParseThingPublish(string data)
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

        public async Task<bool> GetFeatures()
        {
            if ((transports.Count > 0) && (transports[0] != null))
            {
                if (await transports[0].GetFeatures() != true)
                {
                    if ((transports.Count > 1) && (transports[1] != null))
                    {
                        if (await transports[1].GetFeatures() != true)
                        {
                            if ((transports.Count > 2) && (transports[2] != null))
                            {
                                if (await transports[2].GetFeatures() != true)
                                {
                                    return false;
                                }
                            }

                        }
                    }
                }
            }
            return true;
        }


        public async Task<bool> GetAllDriversProperties()
        {
            if ((transports.Count > 0) && (transports[0] != null))
            {
                if (await transports[0].GetAllDriversProperties() != true)
                {
                    if ((transports.Count > 1) && (transports[1] != null))
                    {
                        if (await transports[1].GetAllDriversProperties() != true)
                        {
                            if ((transports.Count > 2) && (transports[2] != null))
                            {
                                if (await transports[2].GetAllDriversProperties() != true)
                                {
                                    return false;
                                }
                            }

                        }
                    }
                }
            }
            return true;
        }
        public async Task<bool> SetDriverProperty(string driver, string property, string value)
        {
            if ((transports.Count > 0) && (transports[0] != null))
            {
                if (await transports[0].SetDriverProperty(driver, property, value) != true)
                {
                    if ((transports.Count > 1) && (transports[1] != null))
                    {
                        if (await transports[1].SetDriverProperty(driver, property, value) != true)
                        {
                            if ((transports.Count > 2) && (transports[2] != null))
                            {
                                if (await transports[2].SetDriverProperty(driver, property, value) != true)
                                {
                                    return false;
                                }
                            }

                        }
                    }
                }
            }
            return true;
        }
        public async Task<string> GetDriverProperty(string driver, string property)
        {
            string value = "%error";
            if ((transports.Count > 0) && (transports[0] != null))
            {
                value = await transports[0].GetDriverProperty(driver, property);
                if (value.Equals("%error"))
                {
                    if ((transports.Count > 1) && (transports[1] != null))
                    {
                        value = await transports[1].GetDriverProperty(driver, property);
                        if (value.Equals("%error"))
                        {
                            if ((transports.Count > 2) && (transports[2] != null))
                            {
                                value = await transports[2].GetDriverProperty(driver, property);
                                if (value.Equals("%error"))
                                {
                                    return "%error";
                                }
                            }
                        }
                    }
                }
            }
            return value;
        }
        public async Task<bool> GetAllFiles()
        {
            if ((transports.Count > 0) && (transports[0] != null))
            {
                if (await transports[0].GetAllFiles() != true)
                {
                    if ((transports.Count > 1) && (transports[1] != null))
                    {
                        if (await transports[1].GetAllFiles() != true)
                        {
                            if ((transports.Count > 2) && (transports[2] != null))
                            {
                                if (await transports[2].GetAllFiles() != true)
                                {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        }
        public async Task<bool> DeleteFile(string fileName)
        {
            if ((transports.Count > 0) && (transports[0] != null))
            {
                if (await transports[0].DeleteFile(fileName) != true)
                {
                    if ((transports.Count > 1) && (transports[1] != null))
                    {
                        if (await transports[1].DeleteFile(fileName) != true)
                        {
                            if ((transports.Count > 2) && (transports[2] != null))
                            {
                                if (await transports[2].DeleteFile(fileName) != true)
                                {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        }

        public async Task<bool> DownloadFile(string fileName)
        {
            bool result = false;
            foreach (IOWLOSTransport _OWLOSTransport in transports)
            {
                result |= await _OWLOSTransport.DownloadFile(fileName);
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
          //  driver.SetMember("topic", "Thing/kitchen");
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
