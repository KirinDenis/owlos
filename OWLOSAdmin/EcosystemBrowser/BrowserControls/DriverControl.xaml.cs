/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/


using OWLOSAdmin.Ecosystem.OWLOS;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for DriverControl.xaml
    /// </summary>
    public partial class DriverControl : UserControl
    {
        public PanelControl ThingPanelControl;

        private readonly ThingDriverItemTag DriverItemTag;

        private int PropertiesCounter = 0;

        public DriverControl(PanelControlTag PanelTag, ThingDriverItemTag DriverItemTag)
        {
            InitializeComponent();
            this.DriverItemTag = DriverItemTag;

            ThingPanelControl = new PanelControl(PanelTag);
            ThingPanelControl.ContentHolder.Children.Add(this);

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
