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
    /// Interaction logic for NodesListControl.xaml
    /// </summary>
    public partial class NodesListControl : UserControl
    {
        private PanelControlTag PanelTag;
        private Admin NodesAdmin;
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

                foreach(OWLOSConnection NodeConnection in  NodeWrapper.node.config.connections)
                {
                    NodeConnectionConfigItemControl NodeConnectionControl = new NodeConnectionConfigItemControl();
                    NodeConnectionControl.EnabledCheckBox.IsChecked = NodeConnection.enable;
                    NodeConnectionControl.NameTextBox.Text = NodeConnection.name;
                    NodeConnectionControl.TypeComboBox.SelectedIndex = (int)NodeConnection.connectionType;
                    NodeConnectionControl.ConnectionStringTextBox.Text = NodeConnection.connectionString;
                    NewNodesListItemControl.ConnectionsStackPanel.Children.Add(NodeConnectionControl);
                }                        
            }
            

            NodesAdmin.OnNewNode += NodesAdmin_OnNewNode;

        }

        private void NodesAdmin_OnNewNode(object sender, OWLOSNodeWrapperEventArgs e)
        {
            OWLOSNodeWrapper NodeWrapper = e.nodeWrapper;

            NodesListItemControl NewNodesListItemControl = new NodesListItemControl();
            NewNodesListItemControl.NameTextBox.Text = NodeWrapper.node.Name;
        }
    }
}
