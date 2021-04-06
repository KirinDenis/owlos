using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOS;
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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for ThingsListItemControl.xaml
    /// </summary>
    public partial class ThingsListItemControl : UserControl
    {
        private OWLOSThingWrapper ThingWrapper;

        private ThingConnectionConfigItemControl RESTfulConfigItemControl;
        private ThingConnectionConfigItemControl MQTTConfigItemControl;
        private ThingConnectionConfigItemControl UARTConfigItemControl;

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
            ThingWrapper.CurrentAdmin.Save();
            
            
        }
    }
}
