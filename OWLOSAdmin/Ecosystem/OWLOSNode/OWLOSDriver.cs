using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOSNode
{
    public class OWLOSDriver : DynamicObject
    {
        public string name = "";

        Dictionary<string, object> properties = new Dictionary<string, object>();

        public event EventHandler NewProperty;

        protected virtual void OnNewProperty(EventArgs e)
        {
            NewProperty?.Invoke(this, e);
        }

        public bool SetParsedProperty(string name, string value)
        {
            string _value = value.Substring(0, value.IndexOf("//"));
            string _flags = value.Substring(value.IndexOf("//") + 2);

            OWLOSDriverProperty property = new OWLOSDriverProperty();
            property.value = _value;
            property.flags = _flags;
            properties[name.ToLower()] = property;
            return true;
        }


        public int Count
        {
            get
            {
                return properties.Count;
            }
        }

        public OWLOSDriver(string name)
        {
            this.name = name;
        }

        public override bool TryGetMember(GetMemberBinder binder, out object result)
        {
            string name = binder.Name.ToLower();
            return properties.TryGetValue(name, out result);
        }

        public override bool TrySetMember(SetMemberBinder binder, object value)
        {
            properties[binder.Name.ToLower()] = value;
            OnNewProperty(new EventArgs());
            return true;
        }

        public override bool TryInvokeMember(InvokeMemberBinder binder, object[] args, out object result)
        {
            return base.TryInvokeMember(binder, args, out result);
        }

        public override bool TryInvoke(InvokeBinder binder, object[] args, out object result)
        {
            return base.TryInvoke(binder, args, out result);
        }

        public override bool TryUnaryOperation(UnaryOperationBinder binder, out object result)
        {
            return TryUnaryOperation(binder, out result);
        }

    }
}
