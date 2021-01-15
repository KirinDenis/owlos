using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemExplorer.EcosystemControls
{
    /// <summary>
    /// Interaction logic for OWLOSLogItemControl.xaml
    /// </summary>
    public partial class OWLOSLogItemControl : UserControl
    {
        public OWLOSLogItemControl(LogItem logItem)
        {
            InitializeComponent();

            DateTimeText.Text = logItem.dateTime.ToString();

            if (logItem.networkStatus == NetworkStatus.Reconnect)
            {
                if (logItem.isSend)
                {
                    sentRecvText.Text = "send";
                }
                else
                {
                    sentRecvText.Text = "recv";
                }

                sizeText.Text = logItem.size.ToString();
            }
            else
            {
                switch (logItem.networkStatus)
                {
                    case NetworkStatus.Online:
                        sentRecvText.Text = "online";
                        break;
                    case NetworkStatus.Offline:
                        sentRecvText.Text = "offline";
                        break;
                    case NetworkStatus.Erorr:
                        sentRecvText.Text = "error";
                        break;
                }
            }

            logText.Text = logItem.text;
        }
    }
}
