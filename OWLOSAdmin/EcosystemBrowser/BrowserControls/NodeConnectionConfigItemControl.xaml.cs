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

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for NodeConnectionConfigItemControl.xaml
    /// </summary>
    public partial class NodeConnectionConfigItemControl : UserControl
    {
        private OWLOSNode Node;
        private OWLOSTransport NodeTransport;
        public NodeConnectionConfigItemControl(OWLOSNode Node, OWLOSTransport NodeTransport)
        {
            InitializeComponent();
            this.Node = Node;
            this.NodeTransport = NodeTransport;
           
            EnabledCheckBox.IsChecked = NodeTransport.connection.enable;
            NameTextBox.Text = NodeTransport.connection.name;
            TypeComboBox.SelectedIndex = (int)NodeTransport.connection.connectionType;
            ConnectionStringTextBox.Text = NodeTransport.connection.connectionString;

            NodeTransport.OnTransportStatusChanger += NodeTransport_OnTransportStatusChanger;
            NodeTransport.OnLogItem += NodeTransport_OnLogItem;

        }

        private void NodeTransport_OnLogItem(object sender, LogItem e)
        {
            base.Dispatcher.Invoke(() =>
            {
                LogTextBlock.Text = e.text;
            });
        }

        private void NodeTransport_OnTransportStatusChanger(object sender, NetworkStatus e)
        {
            base.Dispatcher.Invoke(() =>
            {

                switch (e)
                {
                    case NetworkStatus.Online:
                        StatusTextBlock.Text = "ONLINE";
                        StatusTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSuccess"]).Color);
                        break;
                    case NetworkStatus.Offline:
                        StatusTextBlock.Text = "OFFLINE";
                        StatusTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                        break;

                    case NetworkStatus.Reconnect:
                        StatusTextBlock.Text = "RECONNECT";
                        StatusTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSPrimary"]).Color);
                        break;

                    case NetworkStatus.Erorr:
                        StatusTextBlock.Text = "ERROR";
                        StatusTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color);
                        break;
                }

                SendTextBlock.Text = "send: " + NodeTransport.totlaSend.ToString();
                RecvTextBlock.Text = "recv: " + NodeTransport.totlaRecv.ToString();
            });
        }
    }
}
