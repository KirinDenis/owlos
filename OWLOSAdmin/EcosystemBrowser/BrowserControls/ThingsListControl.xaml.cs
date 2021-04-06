using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOS;
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
