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
    /// Interaction logic for DriverControl.xaml
    /// </summary>
    public partial class DriverControl : UserControl
    {
        public PanelControl NodePanelControl;

        private NodeDriverItemTag DriverItemTag;

        public DriverControl(PanelControlTag PanelTag, NodeDriverItemTag DriverItemTag)
        {
            InitializeComponent();
            this.DriverItemTag = DriverItemTag;

            NodePanelControl = new PanelControl(PanelTag);
            NodePanelControl.ContentHolder.Children.Add(this);

            foreach (OWLOSDriverProperty DriverProperty in DriverItemTag.Driver.properties)
            {
                DriverPropertyControl NewDriverPropertyControl = new DriverPropertyControl();
                NewDriverPropertyControl.propName.Text = DriverProperty.name;
                NewDriverPropertyControl.propValue.Text = DriverProperty.value;                
                DriverPropertiesPanel.Children.Add(NewDriverPropertyControl);
            }
        }
    }
}
