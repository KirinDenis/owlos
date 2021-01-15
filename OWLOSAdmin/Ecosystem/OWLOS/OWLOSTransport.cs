
using System;
using System.Collections.Generic;
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
            get => _networkStatus;
            set
            {
                _networkStatus = value;
                OnTransportStatusChanger?.Invoke(this, value);

                if ((_networkStatus == NetworkStatus.Offline))
                {
                    AddToLog(new LogItem()
                    {
                        dateTime = DateTime.Now,
                        isSend = false,
                        networkStatus = _networkStatus,
                        size = 0
                    });
                }

            }
        }

        
        public event IOWLOSTransport.TransportEventHandler OnTransportStatusChanger;

        public event IOWLOSTransport.LogEventHandler OnLogItem;


        public virtual OWLOSConnection connection { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public object tag { get; set; }
        public long totlaSend { get; set; }
        public long totlaRecv { get; set; }
        public List<LogItem> logItems { get; } = new List<LogItem>();

        public virtual async Task<bool> GetAllDriversProperties()
        {
            throw new NotImplementedException();
        }

        public virtual async Task<bool> GetAllFiles()
        {
            throw new NotImplementedException();
        }

        public virtual async Task<bool> SetDriverProperty(string driver, string property, string value)
        {
            throw new NotImplementedException();
        }

        public void AddToLog(LogItem logItem)
        {
            logItems.Add(logItem);
            OnLogItem?.Invoke(this, logItem);
        }
    }
}
