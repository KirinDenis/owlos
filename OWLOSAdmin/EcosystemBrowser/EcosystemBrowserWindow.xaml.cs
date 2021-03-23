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

using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOS;
using OWLOSAdmin.EcosystemBrowser.BrowserControls;
using OWLOSAdmin.Tools;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSAdmin.EcosystemBrowser
{
    /// <summary>
    /// Interaction logic for EcosystemBrowserWindow.xaml
    /// </summary>
    public partial class EcosystemBrowserWindow : Window
    {

        private TreeViewItem NodesTreeViewItem;
        private NodesListControl ActiveNodesLisControl;

        private Admin NodesAdmin = new Admin();
        public EcosystemBrowserWindow()
        {
            InitializeComponent();

            Icon = Icons.GetIcon(316);

            NodesTreeViewItem = new TreeViewItem();
            NodesTreeViewItem.Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(316), "Nodes");
            NodesTreeViewItem.MouseDoubleClick += NodesTreeViewItem_MouseDoubleClick;

            BrowserTreeView.Items.Add(NodesTreeViewItem);

            NodesAdmin = new Admin();

            NodesAdmin.OnNewNode += Admin_NewOWLOSNode;
            NodesAdmin.Load();


        }

        private void NodesTreeViewItem_MouseDoubleClick(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (sender is TreeViewItem)
            {
                if (!((TreeViewItem)sender).IsSelected)
                {
                    return;
                }
            }

            if (ActiveNodesLisControl == null)
            {
                ActiveNodesLisControl = new NodesListControl(new PanelControlTag
                {
                    Name = "Nodes",
                    Node = null,
                    BrowserGrid = BrowserGrid,
                    BrowserTabsPanel = BrowserTabsPanes
                }, NodesAdmin);
            }

            ActiveNodesLisControl.NodesListPanelControl.Show();
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
            NodesTreeViewItem.Items.Add(NewNodeItemsHolder.NodeBrowserItem);
            
        }

        private void TextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            new IconsToolWindow().Show();
        }
    }
}
