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

using OWLOSAdmin.EcosystemBrowser.BrowserControls;
using OWLOSThingsManager.Ecosystem.OWLOS;
using OWLOSThingsManager.Tools;
using System.Windows.Controls;
using System.Windows.Input;

namespace OWLOSThingsManager.EcosystemBrowser.BrowserControls
{

    public class ThingDriverItemTag
    {
        public OWLOSThing Thing;
        public OWLOSDriver Driver;
        public ThingItemsHolder ParentThingItemsHolder;        
        public DriverControl DriverBrowserControl = null;        
    }
    public class ThingItemsHolder
    {
        public readonly PanelControlTag PanelTag;

        private ThingControl ThingBrowserControl = null;
        public FileControl FileBrowserControl = null;

        public TreeViewItem ThingBrowserItem;
        public TreeViewItem TransportsBrowserItem;
        public TreeViewItem DriversBrowserItem;
        public TreeViewItem ScriptsBrowserItem;
        public TreeViewItem FilesBrowserItem;
        public ThingItemsHolder(PanelControlTag PanelTag)
        {

            this.PanelTag = PanelTag;

            ThingBrowserItem = new TreeViewItem
            {
                Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(65), PanelTag.Name),
                Tag = this
            };
            ThingBrowserItem.MouseDoubleClick += ThingBrowserItem_MouseDoubleClick;

            TransportsBrowserItem = new TreeViewItem
            {
                Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(136), "Transport"),
                Tag = this
            };
            ThingBrowserItem.Items.Add(TransportsBrowserItem);

            DriversBrowserItem = new TreeViewItem
            {
                Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(919), "Drivers"),
                Tag = this
            };
            ThingBrowserItem.Items.Add(DriversBrowserItem);

            ScriptsBrowserItem = new TreeViewItem
            {
                Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(1633), "Scripts"),
                Tag = this
            };
            ThingBrowserItem.Items.Add(ScriptsBrowserItem);

            FilesBrowserItem = new TreeViewItem
            {
                Header = TreeViewItemHeaderControl.Create(Icons.GetIcon(471), "Files"),
                Tag = this
            };
            FilesBrowserItem.MouseDoubleClick += FilesBrowserItem_MouseDoubleClick;
            ThingBrowserItem.Items.Add(FilesBrowserItem);

            foreach (IOWLOSTransport ThingTransport in PanelTag.Thing.transports)
            {
                TreeViewItem ThingTransportItem = new TreeViewItem
                {
                    Header = ThingTransport.connection.name,
                    Tag = ThingTransport
                };
                TransportsBrowserItem.Items.Add(ThingTransportItem);

            }

            PanelTag.Thing.OnNewDriver += NewThing_OnNewDriver;

        }

        private void ThingBrowserItem_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (sender is TreeViewItem)
            {
                if (!((TreeViewItem)sender).IsSelected)
                {
                    return;
                }
            }

            if (ThingBrowserControl == null)
            {                
                ThingBrowserControl = new ThingControl(PanelTag);
            }
            ThingBrowserControl.ThingPanelControl.Show();

        }

        private void NewThing_OnNewDriver(object sender, OWLOSDriverWrapperEventArgs e)
        {
            TreeViewItem ThingDriverItem = new TreeViewItem
            {
                Header = e.driver.name,


                Tag = new ThingDriverItemTag
                {
                    Thing = PanelTag.Thing,
                    Driver = e.driver,
                    ParentThingItemsHolder = this
                }
            };

            ThingDriverItem.MouseDoubleClick += ThingDriverItem_MouseDoubleClick;

            DriversBrowserItem.Items.Add(ThingDriverItem);
            

        }

        private void ThingDriverItem_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            ThingDriverItemTag ClickedThingDriverItemTag = (sender as TreeViewItem).Tag as ThingDriverItemTag;

            if (ClickedThingDriverItemTag.DriverBrowserControl == null)
            {
                PanelTag.Name = ClickedThingDriverItemTag.Driver.name;
                ClickedThingDriverItemTag.DriverBrowserControl = new DriverControl(PanelTag, ClickedThingDriverItemTag);
            }
            ClickedThingDriverItemTag.DriverBrowserControl.ThingPanelControl.Show();            
        }

        private void FilesBrowserItem_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
        
            if (FileBrowserControl == null)
            {

                FileBrowserControl = new FileControl(PanelTag);
            }
            FileBrowserControl.ThingPanelControl.Show();

        }

    }
}
