using OWLOSAdmin.Ecosystem;
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
    /// Interaction logic for NodesListControl.xaml
    /// </summary>
    public partial class NodesListControl : UserControl
    {
        private PanelControlTag PanelTag;
        private Admin NodesAdmin;
        public PanelControl NodesListPanelControl;
        
        public NodesListControl(PanelControlTag PanelTag, Admin NodesAdmin)
        {
            InitializeComponent();

            this.PanelTag = PanelTag;
            this.NodesAdmin = NodesAdmin;

            NodesListPanelControl = new PanelControl(PanelTag);
            NodesListPanelControl.ContentHolder.Children.Add(this);

        }
    }
}
