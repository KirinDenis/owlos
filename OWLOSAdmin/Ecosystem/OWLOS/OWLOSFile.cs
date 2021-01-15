using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.Ecosystem.OWLOS
{

    public class OWLOSFile
    {
      
        public string name = String.Empty;

        protected int _size = -1;

        public delegate void ChangeFileSizeEventHandler(object sender, int size);
        public event ChangeFileSizeEventHandler OnFileSizeChange;
        
        public event EventHandler OnFileDelete;

        public bool exist = true;
        
        public int size
        {
            get
            {
                return _size;
            }
            set
            {
                _size = value;
                OnFileSizeChange?.Invoke(this, value);
            }

        }

        public event EventHandler OnTransportStatusChange;

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
                 TransportStatusChange(new EventArgs());
            }
        }

        public void FileDeleteOutSide()
        {
            OnFileDelete?.Invoke(this, new EventArgs());
        }

        protected virtual void TransportStatusChange(EventArgs e)
        {
            OnTransportStatusChange?.Invoke(this, e);
        }

        public bool FileDownload()
        {
            return true;
        }

    }
}
