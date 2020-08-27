using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;

namespace OWLOSAdmin.Ecosystem
{
    public class Driver: DynamicObject
    {
        Dictionary<string, object> property = new Dictionary<string, object>();

        public int Count
        {
            get
            {
                return property.Count;
            }
        }

        public override bool TryGetMember(GetMemberBinder binder, out object result)
        {
            string name = binder.Name.ToLower();
            return property.TryGetValue(name, out result);
        }

        public override bool TrySetMember(SetMemberBinder binder, object value)
        {            
            property[binder.Name.ToLower()] = value;
            return true;
        }

        public override bool TryInvokeMember(InvokeMemberBinder binder, object[] args, out object result)
        {
            return base.TryInvokeMember(binder, args, out result);
        }

        public override bool  TryInvoke(InvokeBinder binder, object[] args, out object result)
        {
            return base.TryInvoke(binder, args, out result);
        }

        public override bool TryUnaryOperation(UnaryOperationBinder binder, out object result)
        {
            return TryUnaryOperation(binder, out result);
        }
        public bool SetMember(String name, object value)
        {
            property[name.ToLower()] = value;
            return true;
        }

    }
    public class OWLOSNode
    {
        public List<Driver> Drivers { get; set; }

        public void AddDriver()
        {
            dynamic driver = new Driver();
            driver.id = 20;
            driver.id += 50;
          //  driver.set();
            driver.SetMember("topic", "node/kitchen");
            String a = driver.topic;
            driver.topic = "1234";
            //driver(2, 3);
            String b = a + driver.topic;
        }
    }
}
