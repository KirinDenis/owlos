using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public class OWLOSDriverProperty
    {
        public NetworkStatus networkStatus = NetworkStatus.offline;
        public string name;
        public string lastValue;
        public string value;
        public string flags;

        public delegate void PropertyEventHandler(object? sender, OWLOSPropertyWrapperEventArgs e);
        public event PropertyEventHandler ChangeProperty;

        private OWLOSDriver driver;

        public OWLOSDriverProperty(OWLOSDriver driver)
        {
            this.driver = driver;
            //onCreate 
        }

        protected virtual void OnChangeProperty(OWLOSPropertyWrapperEventArgs e)
        {
            ChangeProperty?.Invoke(this, e);
        }

        public async Task<string> GetOutside()
        {
            string result = await driver.parentNode.wrapper.transport.GetDriverProperty(driver.name, this.name);

            return value;
        }

        public async Task<string> SetInside(string _value)
        {
            string result = await driver.parentNode.wrapper.transport.SetDriverProperty(driver.name, this.name, _value);

            return value;
        }

        public void SetOutside(string _value)
        {
            if (value != _value)
            {
                value = _value;
                OWLOSPropertyWrapperEventArgs _OWLOSPropertyWrapperEventArgs = new OWLOSPropertyWrapperEventArgs();
                _OWLOSPropertyWrapperEventArgs.property = this;
                OnChangeProperty(_OWLOSPropertyWrapperEventArgs);
            }

        }

        public string GetLocal()
        {
            return value;
        }

        public void SetLocal(string _value)
        {
            value = _value;
        }

        //onSetValue
        //onChangeValue
        //onGetValue
    }

}
