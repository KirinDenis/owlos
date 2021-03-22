using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{

    public class NodeDriverItemTag
    {
        public OWLOSNode Node;
        public OWLOSDriver Driver;
        public NodeItemsHolder ParentNodeItemsHolder;        
        public DriverControl DriverBrowserControl = null;
    }
    public class NodeItemsHolder
    {
        private PanelControlTag PanelTag;

        private NodeControl NodeBrowserControl = null;
        
        public TreeViewItem NodeBrowserItem;
        public NodeItemsHolder(PanelControlTag PanelTag)
        {

            this.PanelTag = PanelTag;

            NodeBrowserItem = new TreeViewItem();
            NodeBrowserItem.Header = PanelTag.Name;
            NodeBrowserItem.Tag = this;
            NodeBrowserItem.MouseDoubleClick += NodeBrowserItem_MouseDoubleClick;


            foreach (IOWLOSTransport NodeTransport in PanelTag.Node.transports)
            {
                TreeViewItem NodeTransportItem = new TreeViewItem();
                NodeTransportItem.Header = NodeTransport.connection.name;
                NodeTransportItem.Tag = NodeTransport;
                NodeBrowserItem.Items.Add(NodeTransportItem);

            }

            PanelTag.Node.OnNewDriver += NewNode_OnNewDriver;

        }

        private void NodeBrowserItem_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (sender is TreeViewItem)
            {
                if (!((TreeViewItem)sender).IsSelected)
                {
                    return;
                }
            }

            if (NodeBrowserControl == null)
            {                
                NodeBrowserControl = new NodeControl(PanelTag);
            }
            NodeBrowserControl.NodePanelControl.Show();

        }

        private void NewNode_OnNewDriver(object sender, OWLOSDriverWrapperEventArgs e)
        {
            TreeViewItem NodeDriverItem = new TreeViewItem();            
            NodeDriverItem.Header = e.driver.name;


            NodeDriverItem.Tag = new NodeDriverItemTag
            {
                Node = PanelTag.Node,
                Driver = e.driver,
                ParentNodeItemsHolder = this                
            };
                
            NodeDriverItem.MouseDoubleClick += NodeDriverItem_MouseDoubleClick;

            NodeBrowserItem.Items.Add(NodeDriverItem);
            

        }

        private void NodeDriverItem_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            NodeDriverItemTag ClickedNodeDriverItemTag = (sender as TreeViewItem).Tag as NodeDriverItemTag;

            if (ClickedNodeDriverItemTag.DriverBrowserControl == null)
            {
                PanelTag.Name = ClickedNodeDriverItemTag.Driver.name;
                ClickedNodeDriverItemTag.DriverBrowserControl = new DriverControl(PanelTag, ClickedNodeDriverItemTag);
            }
            ClickedNodeDriverItemTag.DriverBrowserControl.NodePanelControl.Show();

            
        }
    }
}
