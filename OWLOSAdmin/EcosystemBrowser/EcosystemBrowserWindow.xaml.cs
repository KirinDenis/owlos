/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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

using OWLOSAdmin.EcosystemBrowser;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using OWLOSThingsManager.EcosystemBrowser.BrowserControls;
using OWLOSThingsManager.Tools;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSThingsManager.EcosystemBrowser
{
    public partial class EcosystemBrowserWindow : Window
    {

        private TreeViewItem ThingsTreeViewItem;
        private ThingsListControl ActiveThingsLisControl;

        private ThingsManager ThingsManager = new ThingsManager();
        public EcosystemBrowserWindow()
        {
            InitializeComponent();

            Icon = Icons.GetIcon(316);

            ThingsManager = new ThingsManager();

            ThingsTreeViewItem = new TreeViewItem();
            ThingsTreeViewItem.Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(316), "Things");
            ThingsTreeViewItem.MouseDoubleClick += ThingsTreeViewItem_MouseDoubleClick;

            BrowserTreeView.Items.Add(ThingsTreeViewItem);

            ThingsManager.OnNewThing += ThingsManager_NewOWLOSThing;
            ThingsManager.OnDeleteThingWrapper += ThingsManager_OnDeleteThingWrapper;
            ThingsManager.Load();

            ActiveThingsLisControl = new ThingsListControl(new PanelControlTag
            {
                Name = "Things",
                Thing = null,
                BrowserGrid = BrowserGrid,
                BrowserTabsPanel = BrowserTabsPanes
            }, ThingsManager);


        }

        private void ThingsManager_OnDeleteThingWrapper(object sender, System.EventArgs e)
        {
            OWLOSThingWrapper ThingWrapper = sender as OWLOSThingWrapper;
            foreach (TreeViewItem TreeItem in ThingsTreeViewItem.Items)
            {
                if ((TreeItem.Tag as ThingItemsHolder).PanelTag.Thing == ThingWrapper.Thing)
                {
                    ThingsTreeViewItem.Items.Remove(TreeItem);
                    break;
                }
            }
        }

        private void ThingsTreeViewItem_MouseDoubleClick(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (sender is TreeViewItem)
            {
                if (!((TreeViewItem)sender).IsSelected)
                {
                    return;
                }
            }

            ActiveThingsLisControl.ThingsListPanelControl.Show();
        }

        private void ThingsManager_NewOWLOSThing(object sender, OWLOSThingWrapperEventArgs e)
        {
            OWLOSThing NewThing = e.ThingWrapper.Thing;
            ThingItemsHolder NewThingItemsHolder = new ThingItemsHolder(new PanelControlTag
            {
                Name = NewThing.Name,
                Thing = NewThing, 
                BrowserGrid = BrowserGrid, 
                BrowserTabsPanel = BrowserTabsPanes 
            });

            ThingsTreeViewItem.Items.Add(NewThingItemsHolder.ThingBrowserItem);
            
        }

        private void TextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            new IconsToolWindow().Show();
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            DialogWindow dialogWindow = new DialogWindow("Are you sure?", "Close OWLOS Ecosystem Browser application?");
            dialogWindow.Owner = this;
            bool? result = dialogWindow.ShowDialog();
            if (result != null)
            {
                if (result == true)
                {
                    foreach (OWLOSThingWrapper ThingWrapper in ThingsManager.OWLOSThingWrappers)
                    {
                        foreach(OWLOSConnection connection in ThingWrapper.Thing.config.connections)
                        {
                            connection.enable = false;
                        }
                    }

                    e.Cancel = false;
                    return;
                }
            }
            e.Cancel = true;

        }
    }
}
