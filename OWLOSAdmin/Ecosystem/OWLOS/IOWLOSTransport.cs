using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public interface IOWLOSAbstractTransport
    {
        abstract public Task<bool> GetAllDriversProperties();

        abstract public Task<bool> GetAllFiles();

        abstract public Task<bool> SetDriverProperty(string driver, string property, string value);
    }

    public class LogItem
    {
        public DateTime dateTime;

        public bool isSend;

        public string text;

        public NetworkStatus networkStatus;

        public int send;

        public int recv;
    }
    public interface IOWLOSTransport : IOWLOSAbstractTransport
    {
        public object tag { get; set; }
        public long totlaSend { get; set; }
        public long totlaRecv { get; set; }
        public List<LogItem> logItems { get; }
        public OWLOSConnection connection { get; set; }

        public void AddToLog(LogItem logItem);

        delegate void TransportEventHandler(object? sender, NetworkStatus e);

        event TransportEventHandler OnTransportStatusChanger;
    }
}
