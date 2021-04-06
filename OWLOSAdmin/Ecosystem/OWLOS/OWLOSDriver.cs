using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;
using System.Threading.Tasks;
using static OWLOSAdmin.Ecosystem.OWLOS.OWLOSDriverProperty;

namespace OWLOSAdmin.Ecosystem.OWLOS
{


    public class OWLOSDriver
    {
        public OWLOSThing parentThing = null;

        public string name = "";

        public List<OWLOSDriverProperty> properties = new List<OWLOSDriverProperty>();

        public event PropertyEventHandler OnPropertyCreate;

        public OWLOSDriver(OWLOSThing parentThing, string name)
        {
            this.parentThing = parentThing;
            this.name = name;
            
        }

        public async Task<bool> SetParsedProperty(string name, string value)
        {
            string _value = value.Substring(0, value.IndexOf("//"));
            string _flags = value.Substring(value.IndexOf("//") + 2);

            OWLOSDriverProperty property =  properties.Find(p => p.name == name);

            if (property == null)
            {
                property = new OWLOSDriverProperty(this, name, _value, _flags);
                properties.Add(property);
                PropertyCreate(new OWLOSPropertyWrapperEventArgs(property));
            }
            else
            {
                property.SetOutside(_value);
            }

            return true;
        }

        protected virtual void PropertyCreate(OWLOSPropertyWrapperEventArgs e)
        {
            OnPropertyCreate?.Invoke(this, e);
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
