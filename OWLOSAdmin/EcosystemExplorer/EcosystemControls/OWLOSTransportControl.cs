using OWLOSAdmin.Ecosystem.OWLOS;
using System.Windows.Media;

namespace OWLOSAdmin.EcosystemExplorer.EcosystemControls
{
    public class OWLOSTransportControl : OWLOSPanelControl
    {
        private readonly IOWLOSTransport transport;

        private int propertyCounter = 0;

        public OWLOSTransportControl(IOWLOSTransport transport) : base()
        {

            this.transport = transport;

            panelName.Text = transport.connection.name;

            if (transport.connection.connectionType == ConnectionType.RESTfulClient)
            {
                OWLOSRESTfulTransportControl RESTfulTransportControl = new OWLOSRESTfulTransportControl(transport);
                panelHolder.Children.Add(RESTfulTransportControl);
            }

        }

    }
}
