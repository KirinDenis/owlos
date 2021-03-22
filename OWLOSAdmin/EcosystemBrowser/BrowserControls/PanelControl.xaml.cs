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

    public class PanelControlTag
    {
        public string Name;
        public OWLOSNode Node;
        public Grid BrowserGrid;
        public StackPanel BrowserTabsPanel;
    }
    /// <summary>
    /// Interaction logic for NodeControl.xaml
    /// </summary>
    public partial class PanelControl : UserControl
    {
        private PanelControlTag PanelTag;

        private TabControl TabControlItem;
               
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
            if (this.Visibility != Visibility.Visible)
            {
                this.Visibility = Visibility.Visible;
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
            this.Visibility = Visibility.Hidden;
            TabControlItem.Visibility = Visibility.Collapsed;
        }

        private void TabsButton_Click(object sender, RoutedEventArgs e)
        {
            
        }
    }
}
