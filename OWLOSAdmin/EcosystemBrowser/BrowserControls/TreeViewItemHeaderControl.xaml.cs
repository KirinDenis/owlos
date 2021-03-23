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
    /// Interaction logic for TreeViewItemHeaderControl.xaml
    /// </summary>
    public partial class TreeViewItemHeaderControl : UserControl
    {
        public static TreeViewItemHeaderControl Create(BitmapImage Image, string Text)
        {
            TreeViewItemHeaderControl NewTreeViewItemHeaderControl = new TreeViewItemHeaderControl();
            NewTreeViewItemHeaderControl.Icon.Source = Image;
            NewTreeViewItemHeaderControl.Text.Text = Text;
            return NewTreeViewItemHeaderControl;
        }
        public TreeViewItemHeaderControl()
        {
            InitializeComponent();
        }
    }
}
