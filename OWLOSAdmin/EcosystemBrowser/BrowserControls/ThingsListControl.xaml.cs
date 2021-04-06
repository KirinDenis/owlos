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
using System.Windows;
using System.Windows.Controls;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for ThingsListControl.xaml
    /// </summary>
    public partial class ThingsListControl : UserControl
    {
        private readonly PanelControlTag PanelTag;
        private readonly Admin ThingsAdmin;
        public PanelControl ThingsListPanelControl;

        public ThingsListControl(PanelControlTag PanelTag, Admin ThingsAdmin)
        {
            InitializeComponent();

            this.PanelTag = PanelTag;
            this.ThingsAdmin = ThingsAdmin;

            ThingsListPanelControl = new PanelControl(PanelTag);
            ThingsListPanelControl.ContentHolder.Children.Add(this);


            //List<OWLOSThingWrapper> OWLOSThingWrappers = new List<OWLOSThingWrapper>();
            
            
                foreach (OWLOSThingWrapper ThingWrapper in ThingsAdmin.OWLOSThingWrappers)
                {
                    ThingsListItemControl NewThingsListItemControl = new ThingsListItemControl(ThingWrapper);
                    ThingsListStackPanel.Children.Add(NewThingsListItemControl);
                }
            


            ThingsAdmin.OnNewThing += ThingsAdmin_OnNewThing;

        }

        private void ThingsAdmin_OnNewThing(object sender, OWLOSThingWrapperEventArgs e)
        {
            OWLOSThingWrapper ThingWrapper = e.ThingWrapper;

            //ThingsListItemControl NewThingsListItemControl = new ThingsListItemControl();
            //NewThingsListItemControl.NameTextBox.Text = ThingWrapper.Thing.Name;
        }

        private void NewConnectionButton_Click(object sender, RoutedEventArgs e)
        {
            //ThingsListItemControl NewThingsListItemControl = new ThingsListItemControl();
            //NewThingsListItemControl.NameTextBox.Text = "New Connection";

            /*
            ThingConnectionConfigItemControl ThingConnectionControl = new ThingConnectionConfigItemControl();
            ThingConnectionControl.EnabledCheckBox.IsChecked = false;
            ThingConnectionControl.NameTextBox.Text = "HTTP(s) RESTful";
            ThingConnectionControl.TypeComboBox.SelectedIndex = 0;
            ThingConnectionControl.ConnectionStringTextBox.Text = "{\"host\":\"http://192.168.4.1/\",\"port\":80}";
            NewThingsListItemControl.ConnectionsStackPanel.Children.Add(ThingConnectionControl);

            ThingConnectionControl = new ThingConnectionConfigItemControl();
            ThingConnectionControl.EnabledCheckBox.IsChecked = false;
            ThingConnectionControl.NameTextBox.Text = "MQTT";
            ThingConnectionControl.TypeComboBox.SelectedIndex = 1;
            ThingConnectionControl.ConnectionStringTextBox.Text = "{\"host\":\"http://192.168.4.1/\"}";
            NewThingsListItemControl.ConnectionsStackPanel.Children.Add(ThingConnectionControl);

            ThingConnectionControl = new ThingConnectionConfigItemControl();
            ThingConnectionControl.EnabledCheckBox.IsChecked = false;
            ThingConnectionControl.NameTextBox.Text = "UART";
            ThingConnectionControl.TypeComboBox.SelectedIndex = 2;
            ThingConnectionControl.ConnectionStringTextBox.Text = "{\"port\":\"COM7\",\"baudRate\":115200,\"parity\":0,\"stopBits\":1,\"dataBits\":8,\"handshake\":0,\"RTSEnable\":false}";
            NewThingsListItemControl.ConnectionsStackPanel.Children.Add(ThingConnectionControl);

            ThingsListStackPanel.Children.Add(NewThingsListItemControl);
            */
        }
    }
}
