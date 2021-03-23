using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
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

        private int PropertiesCounter = 0;

        public DriverControl(PanelControlTag PanelTag, NodeDriverItemTag DriverItemTag)
        {
            InitializeComponent();
            this.DriverItemTag = DriverItemTag;

            NodePanelControl = new PanelControl(PanelTag);
            NodePanelControl.ContentHolder.Children.Add(this);

            foreach (OWLOSDriverProperty DriverProperty in DriverItemTag.Driver.properties)
            {
                AddNewProperty(DriverProperty);
            }

            DriverItemTag.Driver.OnPropertyCreate += Driver_OnPropertyCreate;
        }

        private void Driver_OnPropertyCreate(object sender, OWLOSPropertyWrapperEventArgs e)
        {
            AddNewProperty(e.property);
        }

        private void AddNewProperty(OWLOSDriverProperty DriverProperty)
        {
            DriverPropertyControl NewDriverPropertyControl = new DriverPropertyControl(DriverProperty);

            PropertiesCounter++;
            if ((PropertiesCounter & 1) > 0)
            {
                NewDriverPropertyControl.Background = SystemColors.ControlLightLightBrush;
            }

            DriverPropertiesPanel.Children.Add(NewDriverPropertyControl);

        }

        private void DriverPropertySearch_TextChanged(object sender, TextChangedEventArgs e)
        {
            string TextMask = ((TextBox)sender).Text;

            foreach(DriverPropertyControl PropertyControl in DriverPropertiesPanel.Children)
            {
                //https://stackoverflow.com/questions/11828908/what-is-the-c-sharp-equivalent-of-the-delphi-matchesmask-function

                Match MatchSearch = Regex.Match(PropertyControl.DriverProperty.name,  TextMask + @"([A-Za-z0-9\-]+)", RegexOptions.IgnoreCase);

                if (MatchSearch.Success)
                {
                    PropertyControl.Visibility = Visibility.Visible;
                }
                else
                {
                    PropertyControl.Visibility = Visibility.Collapsed;
                }
            }

        }
    }
}
