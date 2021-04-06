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
    /// Interaction logic for ThingControl.xaml
    /// </summary>
    public partial class ThingControl : UserControl
    {
        public PanelControl ThingPanelControl;

        private PanelControlTag PanelTag;

        public ThingControl(PanelControlTag PanelTag)
        {
            InitializeComponent();
            this.PanelTag = PanelTag;

            ThingPanelControl = new PanelControl(PanelTag);
            ThingPanelControl.ContentHolder.Children.Add(this);
        }
    }
}
