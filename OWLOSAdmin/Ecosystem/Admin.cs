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
        public OWLOSNodeWrapper nodeWrapper;
        public OWLOSNodeWrapperEventArgs(OWLOSNodeWrapper nodeWrapper)
        {
            this.nodeWrapper = nodeWrapper;            
        }
    }
    public class Admin
    {
        
        List<OWLOSNodeWrapper> OWLOSNodeWrappers = new List<OWLOSNodeWrapper>();

        public delegate void NewNodeEventHandler(object? sender, OWLOSNodeWrapperEventArgs e);
        public event NewNodeEventHandler OnNewNode;

        public Admin()
        {
        }

        public void Load()
        {
            OWLOSNodeWrapper nodeWrapper = new OWLOSNodeWrapper();
            nodeWrapper.RESTfulServerHost = "http://192.168.1.101/";

            

            nodeWrapper.node = new OWLOSNode(this, nodeWrapper);
            
            
            nodeWrapper.transport = new OWLOSTransport(nodeWrapper.node);
            nodeWrapper.transport.RESTfulServerHost = nodeWrapper.RESTfulServerHost;
            nodeWrapper.transport.Start();
            OWLOSNodeWrappers.Add(nodeWrapper);
            NewNode(new OWLOSNodeWrapperEventArgs(nodeWrapper));
        }

        protected virtual void NewNode(OWLOSNodeWrapperEventArgs e)
        {
            OnNewNode?.Invoke(this, e);
        }

    }
}
