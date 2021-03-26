using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOS;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for NodesListControl.xaml
    /// </summary>
    public partial class NodesListControl : UserControl
    {
        private readonly PanelControlTag PanelTag;
        private readonly Admin NodesAdmin;
        public PanelControl NodesListPanelControl;

        public NodesListControl(PanelControlTag PanelTag, Admin NodesAdmin)
        {
            InitializeComponent();

            this.PanelTag = PanelTag;
            this.NodesAdmin = NodesAdmin;

            NodesListPanelControl = new PanelControl(PanelTag);
            NodesListPanelControl.ContentHolder.Children.Add(this);


            //List<OWLOSNodeWrapper> OWLOSNodeWrappers = new List<OWLOSNodeWrapper>();
            foreach (OWLOSNodeWrapper NodeWrapper in NodesAdmin.OWLOSNodeWrappers)
            {
                NodesListItemControl NewNodesListItemControl = new NodesListItemControl();
                NewNodesListItemControl.NameTextBox.Text = NodeWrapper.node.Name;

                foreach (OWLOSConnection NodeConnection in NodeWrapper.node.config.connections)
                {
                    NodeConnectionConfigItemControl NodeConnectionControl = new NodeConnectionConfigItemControl();
                    NodeConnectionControl.EnabledCheckBox.IsChecked = NodeConnection.enable;
                    NodeConnectionControl.NameTextBox.Text = NodeConnection.name;
                    NodeConnectionControl.TypeComboBox.SelectedIndex = (int)NodeConnection.connectionType;
                    NodeConnectionControl.ConnectionStringTextBox.Text = NodeConnection.connectionString;
                    NewNodesListItemControl.ConnectionsStackPanel.Children.Add(NodeConnectionControl);
                }
                NodesListStackPanel.Children.Add(NewNodesListItemControl);
            }


            NodesAdmin.OnNewNode += NodesAdmin_OnNewNode;

        }

        private void NodesAdmin_OnNewNode(object sender, OWLOSNodeWrapperEventArgs e)
        {
            OWLOSNodeWrapper NodeWrapper = e.nodeWrapper;

            NodesListItemControl NewNodesListItemControl = new NodesListItemControl();
            NewNodesListItemControl.NameTextBox.Text = NodeWrapper.node.Name;
        }

        private void NewConnectionButton_Click(object sender, RoutedEventArgs e)
        {
            NodesListItemControl NewNodesListItemControl = new NodesListItemControl();
            NewNodesListItemControl.NameTextBox.Text = "New Connection";

            NodeConnectionConfigItemControl NodeConnectionControl = new NodeConnectionConfigItemControl();
            NodeConnectionControl.EnabledCheckBox.IsChecked = false;
            NodeConnectionControl.NameTextBox.Text = "HTTP(s) RESTful";
            NodeConnectionControl.TypeComboBox.SelectedIndex = 0;
            NodeConnectionControl.ConnectionStringTextBox.Text = "{\"host\":\"http://192.168.4.1/\",\"port\":80}";
            NewNodesListItemControl.ConnectionsStackPanel.Children.Add(NodeConnectionControl);

            NodeConnectionControl = new NodeConnectionConfigItemControl();
            NodeConnectionControl.EnabledCheckBox.IsChecked = false;
            NodeConnectionControl.NameTextBox.Text = "MQTT";
            NodeConnectionControl.TypeComboBox.SelectedIndex = 1;
            NodeConnectionControl.ConnectionStringTextBox.Text = "{\"host\":\"http://192.168.4.1/\"}";
            NewNodesListItemControl.ConnectionsStackPanel.Children.Add(NodeConnectionControl);

            NodeConnectionControl = new NodeConnectionConfigItemControl();
            NodeConnectionControl.EnabledCheckBox.IsChecked = false;
            NodeConnectionControl.NameTextBox.Text = "UART";
            NodeConnectionControl.TypeComboBox.SelectedIndex = 2;
            NodeConnectionControl.ConnectionStringTextBox.Text = "{\"port\":\"COM7\",\"baudRate\":115200,\"parity\":0,\"stopBits\":1,\"dataBits\":8,\"handshake\":0,\"RTSEnable\":false}";
            NewNodesListItemControl.ConnectionsStackPanel.Children.Add(NodeConnectionControl);

            NodesListStackPanel.Children.Add(NewNodesListItemControl);
        }
    }
}
