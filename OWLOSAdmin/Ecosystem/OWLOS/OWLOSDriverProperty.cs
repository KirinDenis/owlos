using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{

    public class OWLOSPropertyWrapperEventArgs : EventArgs
    {
        public OWLOSDriverProperty property;

        public OWLOSPropertyWrapperEventArgs(OWLOSDriverProperty property)
        {
            this.property = property;
        }
    }

    public class OWLOSDriverProperty
    {
        protected NetworkStatus _networkStatus = NetworkStatus.Offline;
        public NetworkStatus networkStatus
        {
            get
            {
                return _networkStatus;
            }
            set
            {
                _networkStatus = value;
                PropertyTransportStatusChange(new OWLOSPropertyWrapperEventArgs(this));
            }
        }

        protected string _name = string.Empty;
        public string name
        {
            get
            {
                return _name;
            }
            set
            {
                if (string.IsNullOrEmpty(_name)) //can be set only once TODO: error event
                {
                    _name = value;
                }
            }
        }

        public string lastValue; //??? FFR

        protected string _value = string.Empty;
        public string value
        {
            get
            {
                return _value;
            }

            set
            {
                _value = value;
                PropertyChange(new OWLOSPropertyWrapperEventArgs(this));
            }
        }

        //TODO COPY flags parser class here
        public string flags;

        public delegate void PropertyEventHandler(object? sender, OWLOSPropertyWrapperEventArgs e);

        

        public event PropertyEventHandler OnPropertyChange;
        public event PropertyEventHandler OnPropertySetInside;
        public event PropertyEventHandler OnPropertySetOutside;

        public event PropertyEventHandler OnPropertyGetInside;
        public event PropertyEventHandler OnPropertyGetOutside;
        public event PropertyEventHandler OnPropertyTransportStatusChange;

        private OWLOSDriver driver;

        public OWLOSDriverProperty(OWLOSDriver driver, string name, string value, string flags)
        {
            this.driver = driver;

            this.name = name;
            this._value = value;
            this.flags = flags;

            

            networkStatus = NetworkStatus.Online;

        }


        protected virtual void PropertyChange(OWLOSPropertyWrapperEventArgs e)
        {
            OnPropertyChange?.Invoke(this, e);
        }

        protected virtual void PropertySetInside(OWLOSPropertyWrapperEventArgs e)
        {
            OnPropertySetInside?.Invoke(this, e);
        }

        protected virtual void PropertySetOutside(OWLOSPropertyWrapperEventArgs e)
        {
            OnPropertySetOutside?.Invoke(this, e);
        }

        protected virtual void PropertyGetInside(OWLOSPropertyWrapperEventArgs e)
        {
            OnPropertyGetInside?.Invoke(this, e);
        }

        protected virtual void PropertyGetOutside(OWLOSPropertyWrapperEventArgs e)
        {
            OnPropertyGetOutside?.Invoke(this, e);
        }

        protected virtual void PropertyTransportStatusChange(OWLOSPropertyWrapperEventArgs e)
        {
            OnPropertyTransportStatusChange?.Invoke(this, e);
        }


        //--------------------------------------------------------------------------------------------------------
        public async Task<string> GetOutside()
        {
            if (networkStatus == NetworkStatus.Reconnect)
            {
                return value;
            }

            networkStatus = NetworkStatus.Reconnect;

            try
            {
                /*
                string result = await driver.parentNode.wrapper.transport.GetDriverProperty(driver.name, this.name);

                if (result.IndexOf("%error") != 0)
                {
                    networkStatus = NetworkStatus.online;
                    value = result;
                    PropertyGetOutside(new OWLOSPropertyWrapperEventArgs(this));
                }
                else
                {
                    networkStatus = NetworkStatus.erorr;
                }
                */

            }
            catch (Exception exception) //TODO: last error or on error event
            {
                networkStatus = NetworkStatus.Offline;
            }

            return value;
        }

        public async Task<string> SetInside(string _value)
        {

            if (networkStatus == NetworkStatus.Reconnect)
            {
                return "error reconnect";
            }

            networkStatus = NetworkStatus.Reconnect;

            bool result = await driver.parentNode.SetDriverProperty(driver.name, this.name, _value);

            if (result)
            {
                networkStatus = NetworkStatus.Online;
                PropertySetInside(new OWLOSPropertyWrapperEventArgs(this));
                return string.Empty;
            }
            else
            {
                networkStatus = NetworkStatus.Erorr;
            }


            try
            {
                /*
                string result = await driver.parentNode.wrapper.transport.SetDriverProperty(driver.name, this.name, _value);

                if (result.IndexOf("%error") != 0)
                {
                    networkStatus = NetworkStatus.online;                    
                    PropertySetInside(new OWLOSPropertyWrapperEventArgs(this));
                    return string.Empty;
                }
                else
                {
                    networkStatus = NetworkStatus.erorr;
                }
                */
            }
            catch (Exception exception) //TODO: last error or on error event
            {
                networkStatus = NetworkStatus.Offline;
            }

            return "error";
        }

        public void SetOutside(string _value)
        {
            if (value != _value)
            {
                networkStatus = NetworkStatus.Online;
                value = _value;
                PropertySetOutside(new OWLOSPropertyWrapperEventArgs(this));
            }
        }

    }

}
