/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

using OWLOSAdmin.Ecosystem.OWLOS;
using OWLOSAdmin.Tools;
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
        public TreeViewItem TransportsBrowserItem;
        public TreeViewItem DriversBrowserItem;
        public TreeViewItem ScriptsBrowserItem;
        public TreeViewItem FilesBrowserItem;
        public NodeItemsHolder(PanelControlTag PanelTag)
        {

            this.PanelTag = PanelTag;

            NodeBrowserItem = new TreeViewItem();
            NodeBrowserItem.Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(65), PanelTag.Name);
            NodeBrowserItem.Tag = this;
            NodeBrowserItem.MouseDoubleClick += NodeBrowserItem_MouseDoubleClick;

            TransportsBrowserItem = new TreeViewItem();
            TransportsBrowserItem.Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(136), "Transport");
            TransportsBrowserItem.Tag = this;
            NodeBrowserItem.Items.Add(TransportsBrowserItem);

            DriversBrowserItem = new TreeViewItem();
            DriversBrowserItem.Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(919), "Drivers");
            DriversBrowserItem.Tag = this;
            NodeBrowserItem.Items.Add(DriversBrowserItem);

            ScriptsBrowserItem = new TreeViewItem();
            ScriptsBrowserItem.Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(1633), "Scripts");
            ScriptsBrowserItem.Tag = this;
            NodeBrowserItem.Items.Add(ScriptsBrowserItem);

            FilesBrowserItem = new TreeViewItem();
            FilesBrowserItem.Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(471), "Files");
            FilesBrowserItem.Tag = this;
            NodeBrowserItem.Items.Add(FilesBrowserItem);

            foreach (IOWLOSTransport NodeTransport in PanelTag.Node.transports)
            {
                TreeViewItem NodeTransportItem = new TreeViewItem();
                NodeTransportItem.Header = NodeTransport.connection.name;
                NodeTransportItem.Tag = NodeTransport;
                TransportsBrowserItem.Items.Add(NodeTransportItem);

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

            DriversBrowserItem.Items.Add(NodeDriverItem);
            

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
