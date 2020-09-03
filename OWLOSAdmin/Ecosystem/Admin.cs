using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;

namespace OWLOSAdmin.Ecosystem
{

    public class OWLOSNodeWrapper
    {
        public OWLOSTransport transport;
        public OWLOSNode node = null;
        public string RESTfulServerHost = string.Empty;
        public Point explorerPosition;
    }

    public class OWLOSNodeWrapperEventArgs : EventArgs
    {
        public OWLOSNodeWrapper node;
    }

   

    

    class Admin
    {
        
        List<OWLOSNodeWrapper> OWLOSNodeWrappers = new List<OWLOSNodeWrapper>();

        public delegate void EventHandler2(object? sender, OWLOSNodeWrapperEventArgs e);
        public event EventHandler2 NewOWLOSNode;

        public Admin()
        {
        }

        public void Load()
        {
            OWLOSNodeWrapper nodeWrapper = new OWLOSNodeWrapper();
            nodeWrapper.node = new OWLOSNode();

            OWLOSNodeWrapperEventArgs eventArgs = new OWLOSNodeWrapperEventArgs();
            eventArgs.node = nodeWrapper;

            OnNewOWLOSNode(eventArgs);
            nodeWrapper.transport = new OWLOSTransport(nodeWrapper.node);
            nodeWrapper.transport.RESTfulServerHost = nodeWrapper.RESTfulServerHost;
            nodeWrapper.transport.Start();
            OWLOSNodeWrappers.Add(nodeWrapper);            
        }

        protected virtual void OnNewOWLOSNode(OWLOSNodeWrapperEventArgs e)
        {
            NewOWLOSNode?.Invoke(this, e);
        }

    }
}
