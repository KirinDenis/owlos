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


using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSThingsManager.EcosystemBrowser.BrowserControls
{

    public class PanelControlTag
    {
        public string Name;
        public OWLOSThing Thing;
        public Grid BrowserGrid;
        public StackPanel BrowserTabsPanel;
    }
    /// <summary>
    /// Interaction logic for ThingControl.xaml
    /// </summary>
    public partial class PanelControl : UserControl
    {
        private readonly PanelControlTag PanelTag;

        private readonly TabControl TabControlItem;
               
        public PanelControl(PanelControlTag PanelTag)
        {
            this.PanelTag = PanelTag;

            InitializeComponent();

            TabControlItem = new TabControl();
            TabControlItem.NameTextBlock.Text = PanelTag.Name;
            TabControlItem.OnSelect += TabControlItem_OnSelect;
            TabControlItem.OnClose += TabControlItem_OnClose;

            //TabsButton = new Button();
            //TabsButton.Content = PanelTag.Name +  " x";
            //TabsButton.Click += TabsButton_Click;

            PanelTag.BrowserGrid.Children.Add(this);
            PanelTag.BrowserTabsPanel.Children.Add(TabControlItem);

        }

        private void TabControlItem_OnClose(object sender, EventArgs e)
        {
            Hide();
        }

        private void TabControlItem_OnSelect(object sender, EventArgs e)
        {
            Show();
        }

        public void Show()
        {
            if (Visibility != Visibility.Visible)
            {
                Visibility = Visibility.Visible;
                TabControlItem.Visibility = Visibility.Visible;
            }

            PanelTag.BrowserGrid.Children.Remove(this);
            PanelTag.BrowserGrid.Children.Add(this);

            foreach (TabControl NextTabControl in PanelTag.BrowserTabsPanel.Children)
            {
                NextTabControl.Active = false;
            }

            TabControlItem.Active = true;
        }

        public void Hide()
        {
            Visibility = Visibility.Hidden;
            TabControlItem.Visibility = Visibility.Collapsed;
        }

        private void TabsButton_Click(object sender, RoutedEventArgs e)
        {
            
        }
    }
}
