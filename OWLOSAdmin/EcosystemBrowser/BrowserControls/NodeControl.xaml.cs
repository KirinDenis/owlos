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
    /// Interaction logic for NodeControl.xaml
    /// </summary>
    public partial class NodeControl : UserControl
    {
        public PanelControl NodePanelControl;

        private PanelControlTag PanelTag;

        public NodeControl(PanelControlTag PanelTag)
        {
            InitializeComponent();
            this.PanelTag = PanelTag;

            NodePanelControl = new PanelControl(PanelTag);
            NodePanelControl.ContentHolder.Children.Add(this);
        }
    }
}
