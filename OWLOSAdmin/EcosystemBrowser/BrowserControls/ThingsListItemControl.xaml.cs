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


using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSThingsManager.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for ThingsListItemControl.xaml
    /// </summary>
    public partial class ThingsListItemControl : UserControl
    {
        private readonly OWLOSThingWrapper ThingWrapper;

        private readonly ThingConnectionConfigItemControl RESTfulConfigItemControl;
        private readonly ThingConnectionConfigItemControl MQTTConfigItemControl;
        private readonly ThingConnectionConfigItemControl UARTConfigItemControl;

        public event EventHandler OnDelete;

        public ThingsListItemControl(OWLOSThingWrapper ThingWrapper)
        {
            InitializeComponent();
            this.ThingWrapper = ThingWrapper;

            NameTextBox.Text = ThingWrapper.Thing.Name;

            foreach (OWLOSTransport ThingTransport in ThingWrapper.Thing.transports)
            {
                switch (ThingTransport.connection.connectionType)
                {
                    case ConnectionType.RESTfulClient:
                        RESTfulConfigItemControl = new ThingConnectionConfigItemControl(ThingWrapper.Thing, ThingTransport);
                        ConnectionsStackPanel.Children.Add(RESTfulConfigItemControl);
                        break;
                    case ConnectionType.MQTT:
                        MQTTConfigItemControl = new ThingConnectionConfigItemControl(ThingWrapper.Thing, ThingTransport);
                        ConnectionsStackPanel.Children.Add(MQTTConfigItemControl);
                        break;
                    case ConnectionType.UART:
                        UARTConfigItemControl = new ThingConnectionConfigItemControl(ThingWrapper.Thing, ThingTransport);
                        ConnectionsStackPanel.Children.Add(UARTConfigItemControl);
                        break;
                }
            }

            foreach (APIQueryInterval CurrentAPIQueryInterval in ThingWrapper.Thing.config.APIQueryIntervals)
            {
                QueryIntervalControl NewQueryIntervalControl = new QueryIntervalControl(CurrentAPIQueryInterval);
                QueryIntervalsStackPanel.Children.Add(NewQueryIntervalControl);
            }
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            foreach (OWLOSTransport ThingTransport in ThingWrapper.Thing.transports)
            {
                switch (ThingTransport.connection.connectionType)
                {
                    case ConnectionType.RESTfulClient:
                        ThingTransport.connection.enable = RESTfulConfigItemControl.EnabledCheckBox.IsChecked.Value;
                        ThingTransport.connection.name = RESTfulConfigItemControl.NameTextBox.Text;
                        ThingTransport.connection.connectionString = RESTfulConfigItemControl.ConnectionStringTextBox.Text;
                        break;
                    case ConnectionType.MQTT:
                        ThingTransport.connection.enable = MQTTConfigItemControl.EnabledCheckBox.IsChecked.Value;
                        ThingTransport.connection.name = MQTTConfigItemControl.NameTextBox.Text;
                        ThingTransport.connection.connectionString = MQTTConfigItemControl.ConnectionStringTextBox.Text;
                        break;
                    case ConnectionType.UART:
                        ThingTransport.connection.enable = UARTConfigItemControl.EnabledCheckBox.IsChecked.Value;
                        ThingTransport.connection.name = UARTConfigItemControl.NameTextBox.Text;
                        ThingTransport.connection.connectionString = UARTConfigItemControl.ConnectionStringTextBox.Text;
                        break;
                }
                //Reset connection settings for current transport
                ThingTransport.connection = ThingTransport.connection;
            }
            ThingWrapper.CurrentThingsManager.Save();
        }

        private void NameTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            if ((!string.IsNullOrWhiteSpace(NameTextBox.Text)) && (ThingWrapper != null))
            {
                ThingWrapper.Thing.config.Name = NameTextBox.Text;
            }
        }

        private void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            if (ThingWrapper.CurrentThingsManager.DeleteThingWrapper(ThingWrapper))
            {
                OnDelete?.Invoke(this, new EventArgs());
            }
        }
    }
}
