using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public interface IOWLOSAbstractTransport
    {
        abstract public Task<bool> GetAllDriversProperties();

        abstract public Task<bool> GetAllFiles();

        abstract public Task<bool> DownLoadFile(string fileName);

        abstract public Task<bool> SetDriverProperty(string driver, string property, string value);


    }
    public interface IOWLOSTransport : IOWLOSAbstractTransport
    {
        public object tag { get; set; }
        public OWLOSConnection connection { get; set; }

        delegate void TransportEventHandler(object? sender, NetworkStatus e);

        event TransportEventHandler OnTransportStatusChanger;
    }
}
