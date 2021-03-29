using OWLOSAdmin.Ecosystem;
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
    /// Interaction logic for NodesListItemControl.xaml
    /// </summary>
    public partial class NodesListItemControl : UserControl
    {
        private OWLOSNodeWrapper NodeWrapper;

        private NodeConnectionConfigItemControl RESTfulConfigItemControl;
        private NodeConnectionConfigItemControl MQTTConfigItemControl;
        private NodeConnectionConfigItemControl UARTConfigItemControl;

        public NodesListItemControl(OWLOSNodeWrapper NodeWrapper)
        {
            InitializeComponent();
            this.NodeWrapper = NodeWrapper;

            NameTextBox.Text = NodeWrapper.node.Name;

            foreach (OWLOSTransport NodeTransport in NodeWrapper.node.transports)
            {
                switch (NodeTransport.connection.connectionType)
                {
                    case ConnectionType.RESTfulClient:
                        RESTfulConfigItemControl = new NodeConnectionConfigItemControl(NodeWrapper.node, NodeTransport);
                        ConnectionsStackPanel.Children.Add(RESTfulConfigItemControl);
                        break;
                    case ConnectionType.MQTT:
                        MQTTConfigItemControl = new NodeConnectionConfigItemControl(NodeWrapper.node, NodeTransport);
                        ConnectionsStackPanel.Children.Add(MQTTConfigItemControl);
                        break;
                    case ConnectionType.UART:
                        UARTConfigItemControl = new NodeConnectionConfigItemControl(NodeWrapper.node, NodeTransport);
                        ConnectionsStackPanel.Children.Add(UARTConfigItemControl);
                        break;
                }
            }
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            foreach (OWLOSTransport NodeTransport in NodeWrapper.node.transports)
            {
                switch (NodeTransport.connection.connectionType)
                {
                    case ConnectionType.RESTfulClient:
                        NodeTransport.connection.enable = RESTfulConfigItemControl.EnabledCheckBox.IsChecked.Value;
                        NodeTransport.connection.name = RESTfulConfigItemControl.NameTextBox.Text;
                        NodeTransport.connection.connectionString = RESTfulConfigItemControl.ConnectionStringTextBox.Text;
                        break;
                    case ConnectionType.MQTT:
                        NodeTransport.connection.enable = MQTTConfigItemControl.EnabledCheckBox.IsChecked.Value;
                        NodeTransport.connection.name = MQTTConfigItemControl.NameTextBox.Text;
                        NodeTransport.connection.connectionString = MQTTConfigItemControl.ConnectionStringTextBox.Text;
                        break;
                    case ConnectionType.UART:
                        NodeTransport.connection.enable = UARTConfigItemControl.EnabledCheckBox.IsChecked.Value;
                        NodeTransport.connection.name = UARTConfigItemControl.NameTextBox.Text;
                        NodeTransport.connection.connectionString = UARTConfigItemControl.ConnectionStringTextBox.Text;
                        break;
                }
                //Reset connection settings for current transport
                NodeTransport.connection = NodeTransport.connection;
            }
            NodeWrapper.CurrentAdmin.Save();
            
            
        }
    }
}
