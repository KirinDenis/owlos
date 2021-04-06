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

using System;
using System.Threading.Tasks;

namespace OWLOSThingsManager.Ecosystem.OWLOS
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
            get => _networkStatus;
            set
            {
                _networkStatus = value;
                PropertyTransportStatusChange(new OWLOSPropertyWrapperEventArgs(this));
            }
        }

        protected string _name = string.Empty;
        public string name
        {
            get => _name;
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
            get => _value;

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

        private readonly OWLOSDriver driver;

        public OWLOSDriverProperty(OWLOSDriver driver, string name, string value, string flags)
        {
            this.driver = driver;

            this.name = name;
            _value = value;
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
                string result = await driver.parentThing.wrapper.transport.GetDriverProperty(driver.name, this.name);

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
            catch (Exception) //TODO: last error or on error event
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

            bool result = await driver.parentThing.SetDriverProperty(driver.name, name, _value);

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
                string result = await driver.parentThing.wrapper.transport.SetDriverProperty(driver.name, this.name, _value);

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
            catch (Exception) //TODO: last error or on error event
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
