using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOSNode
{
    public class OWLOSDriverProperty
    {
        public NetworkStatus networkStatus = NetworkStatus.offline;
        public string name;
        public string lastValue;
        public string value;
        public string flags;

        public OWLOSDriverProperty()
        {
            //onCreate 
        }

        public string GetOutside()
        {
            return value;
        }

        public void SetOutside(string _value)
        {
            value = _value;
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
