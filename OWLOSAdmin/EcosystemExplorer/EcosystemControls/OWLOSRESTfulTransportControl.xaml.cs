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
    /// Interaction logic for OWLOSRESTfulTransportControl.xaml
    /// </summary>
    public partial class OWLOSRESTfulTransportControl : UserControl
    {
        private RESTfulClientTransport transport;

        private OWLOSLogPanelControl logPanel;
        private OWLOSLogPanelControl recvLogPanel;

        public OWLOSRESTfulTransportControl(IOWLOSTransport transport)
        {
            InitializeComponent();

            this.transport = transport as RESTfulClientTransport;
            this.transport.OnTransportStatusChanger += Transport_OnTransportStatusChanger;
            this.transport.OnLogItem += Transport_OnLogItem;

            enabledCheckbox.IsChecked = this.transport.connection.enable;
            nameText.Text = this.transport.connection.name;
            hostText.Text = this.transport._RESTfulClientConnectionDTO.host;
            portText.Text = this.transport._RESTfulClientConnectionDTO.port.ToString();

            logGrid.Children.Add(logPanel = new OWLOSLogPanelControl());
            recvLogGrid.Children.Add(recvLogPanel = new OWLOSLogPanelControl());
        }

        private void Transport_OnLogItem(object sender, LogItem e)
        {
            base.Dispatcher.Invoke(() =>
            {

                if (e.isSend)
                {
                    switch (e.networkStatus)
                    {
                        case NetworkStatus.Online:
                            
                            logPanel.AddToLog(e.text, 0);
                            break;

                        case NetworkStatus.Offline:
                            logPanel.AddToLog(e.text, 1);                            
                            break;

                        case NetworkStatus.Reconnect:
                            logPanel.AddToLog(e.text, 2);                            
                            break;

                        case NetworkStatus.Erorr:
                            logPanel.AddToLog(e.text, 3);                            
                            break;
                    }
                    
                }
                else
                {
                    recvLogPanel.AddToLog(e.text, 2);
                }
                
            });
        }

        private void Transport_OnTransportStatusChanger(object sender, NetworkStatus e)
        {
            base.Dispatcher.Invoke(() =>
            {
                
                switch (e)
                {
                    case NetworkStatus.Online:
                        networkStatuText.Text = "ONLINE";
                        break;
                    case NetworkStatus.Offline:
                        networkStatuText.Text = "OFFLINE";
                        break;

                    case NetworkStatus.Reconnect:
                        networkStatuText.Text = "RECONNECT";
                        break;

                    case NetworkStatus.Erorr:
                        networkStatuText.Text = "ERROR";
                        break;
                }

                send_recv_Text.Text = transport.totlaSend.ToString() + "/" + transport.totlaRecv.ToString();
            });
        }

        private void enabledCheckbox_Checked(object sender, RoutedEventArgs e)
        {
            if (transport != null)
            {
                transport.connection.enable = enabledCheckbox.IsChecked.Value;
            }
        }


    }
}
