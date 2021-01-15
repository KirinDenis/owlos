
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public enum NetworkStatus
    {
        Offline = 0,
        Online,
        Reconnect,
        Erorr
    }

    public class OWLOSTransportArgs : EventArgs
    {
        public OWLOSTransportArgs(NetworkStatus networkStatus)
        {
            this.networkStatus = networkStatus;
        }

        public NetworkStatus networkStatus;
    }


    public class OWLOSTransport : IOWLOSTransport
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
                OnTransportStatusChanger?.Invoke(this, value);
            }        
        }

        //public delegate void TransportEventHandler(object? sender, NetworkStatus e);

        public event IOWLOSTransport.TransportEventHandler OnTransportStatusChanger;


        virtual public OWLOSConnection connection { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public object tag { get; set; }

        virtual public async Task<bool> GetAllDriversProperties()
        {
            throw new NotImplementedException();
        }

        virtual public async Task<bool> GetAllFiles()
        {
            throw new NotImplementedException();
        }

        virtual public async Task<bool> SetDriverProperty(string driver, string property, string value)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DownLoadFile(string fileName)
        {
            throw new NotImplementedException();
        }
    }
}
