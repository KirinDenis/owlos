using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{

    public class OWLOSPropertyWrapperEventArgs : EventArgs
    {
        public OWLOSDriverProperty property;
    }

    public class OWLOSDriver
    {
        public OWLOSNode parentNode = null;

        public string name = "";

        List<OWLOSDriverProperty> properties = new List<OWLOSDriverProperty>();

        public delegate void PropertyEventHandler(object? sender, OWLOSPropertyWrapperEventArgs e);

        public event PropertyEventHandler NewProperty;


        public OWLOSDriver(OWLOSNode parentNode, string name)
        {
            this.parentNode = parentNode;
            this.name = name;
            
        }

        protected virtual void OnNewProperty(OWLOSPropertyWrapperEventArgs e)
        {
            NewProperty?.Invoke(this, e);
        }

        public async Task<bool> SetParsedProperty(string name, string value)
        {
            string _value = value.Substring(0, value.IndexOf("//"));
            string _flags = value.Substring(value.IndexOf("//") + 2);

            OWLOSDriverProperty property = new OWLOSDriverProperty();
            property.name = name;
            property.value = _value;
            property.flags = _flags;
            properties.Add(property);
            OWLOSPropertyWrapperEventArgs _OWLOSPropertyWrapperEventArgs = new OWLOSPropertyWrapperEventArgs();
            _OWLOSPropertyWrapperEventArgs.property = property; 
            OnNewProperty(_OWLOSPropertyWrapperEventArgs);
            return true;
        }

        public int GetPropertiesCount()
        {
            return properties.Count;
        }
        public OWLOSDriverProperty GetProperty(string name)
        {
            return properties.Find(p => p.name == name);
        }

        public bool SetPropertyValue(string name, string value)
        {
            OWLOSDriverProperty property = GetProperty(name);
            if (property == null)
            {
                return false;
            }

            property.value = value;
            return true;
        }

    }

}
