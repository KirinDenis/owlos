using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOS;
using OWLOSAdmin.EcosystemBrowser.BrowserControls;
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
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemBrowser
{
    /// <summary>
    /// Interaction logic for EcosystemBrowserWindow.xaml
    /// </summary>
    public partial class EcosystemBrowserWindow : Window
    {
        
        public EcosystemBrowserWindow()
        {
            InitializeComponent();

            Admin admin = new Admin();

            admin.OnNewNode += Admin_NewOWLOSNode;
            admin.Load();
        }

        private void Admin_NewOWLOSNode(object sender, OWLOSNodeWrapperEventArgs e)
        {
            OWLOSNode NewNode = e.nodeWrapper.node;
            NodeItemsHolder NewNodeItemsHolder = new NodeItemsHolder(new PanelControlTag
            {
                Name = "OWLOS Node",
                Node = NewNode, 
                BrowserGrid = BrowserGrid, 
                BrowserTabsPanel = BrowserTabsPanes 
            });
            BrowserTreeView.Items.Add(NewNodeItemsHolder.NodeBrowserItem);
            
        }


    }
}
