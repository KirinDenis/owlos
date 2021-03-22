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
    /// Interaction logic for TabControl.xaml
    /// </summary>
    public partial class TabControl : UserControl
    {
        private bool _Active = false;
        public bool Active
        {
            get
            {
                return _Active;
            }

            set
            {
                if (value)
                {
                    Background = new SolidColorBrush(Color.FromArgb(0xFF, 0xFF, 0xE0, 0xAC));                    
                }
                else
                {
                    Background = new SolidColorBrush(Color.FromArgb(0xFF, 0x3B, 0x4F, 0x81));
                }
                _Active = value;
            }
        }

        public event EventHandler OnSelect;
        public event EventHandler OnClose;
        public TabControl()
        {
            InitializeComponent();
        }

        private void NameTextBlock_MouseDown(object sender, MouseButtonEventArgs e)
        {
            OnSelect?.Invoke(this, new EventArgs());
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            OnClose?.Invoke(this, new EventArgs());
        }
    }
}
