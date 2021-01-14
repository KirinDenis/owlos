﻿using OWLOSAdmin.Ecosystem.OWLOS;
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

        public OWLOSRESTfulTransportControl(IOWLOSTransport transport)
        {
            InitializeComponent();

            this.transport = transport as RESTfulClientTransport;
            this.transport.OnTransportStatusChanger += Transport_OnTransportStatusChanger;

            nameText.Text = this.transport.connection.name;
            hostText.Text = this.transport._RESTfulClientConnectionDTO.host;
            portText.Text = this.transport._RESTfulClientConnectionDTO.port.ToString();
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
    }
}
