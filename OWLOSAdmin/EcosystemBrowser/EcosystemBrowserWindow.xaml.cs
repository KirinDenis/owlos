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

        private TreeViewItem ThingsTreeViewItem;
        private ThingsListControl ActiveThingsLisControl;

        private Admin ThingsAdmin = new Admin();
        public EcosystemBrowserWindow()
        {
            InitializeComponent();

            Icon = Icons.GetIcon(316);

            ThingsAdmin = new Admin();


            ThingsTreeViewItem = new TreeViewItem();
            ThingsTreeViewItem.Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(316), "Things");
            ThingsTreeViewItem.MouseDoubleClick += ThingsTreeViewItem_MouseDoubleClick;

            BrowserTreeView.Items.Add(ThingsTreeViewItem);

            ThingsAdmin.OnNewThing += Admin_NewOWLOSThing;
            ThingsAdmin.OnDeleteThingWrapper += ThingsAdmin_OnDeleteThingWrapper;
            ThingsAdmin.Load();

            ActiveThingsLisControl = new ThingsListControl(new PanelControlTag
            {
                Name = "Things",
                Thing = null,
                BrowserGrid = BrowserGrid,
                BrowserTabsPanel = BrowserTabsPanes
            }, ThingsAdmin);


        }

        private void ThingsAdmin_OnDeleteThingWrapper(object sender, System.EventArgs e)
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

        private void Admin_NewOWLOSThing(object sender, OWLOSThingWrapperEventArgs e)
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
    }
}
