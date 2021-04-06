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

using OWLOSThingsManager.Ecosystem;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSThingsManager.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for ThingsListControl.xaml
    /// </summary>
    public partial class ThingsListControl : UserControl
    {
        private readonly PanelControlTag PanelTag;
        private readonly ThingsManager ThingsThingsManager;
        public PanelControl ThingsListPanelControl;

        public ThingsListControl(PanelControlTag PanelTag, ThingsManager ThingsThingsManager)
        {
            InitializeComponent();

            this.PanelTag = PanelTag;
            this.ThingsThingsManager = ThingsThingsManager;

            ThingsListPanelControl = new PanelControl(PanelTag);
            ThingsListPanelControl.ContentHolder.Children.Add(this);

            foreach (OWLOSThingWrapper ThingWrapper in ThingsThingsManager.OWLOSThingWrappers)
            {
                ThingsListItemControl NewThingsListItemControl = new ThingsListItemControl(ThingWrapper);
                ThingsListStackPanel.Children.Add(NewThingsListItemControl);
                NewThingsListItemControl.OnDelete += NewThingsListItemControl_OnDelete;
            }

            ThingsThingsManager.OnNewThing += ThingsThingsManager_OnNewThing;
        }

        private void NewThingsListItemControl_OnDelete(object sender, System.EventArgs e)
        {
            ThingsListStackPanel.Children.Remove(sender as ThingsListItemControl);
        }

        private void ThingsThingsManager_OnNewThing(object sender, OWLOSThingWrapperEventArgs e)
        {
            OWLOSThingWrapper ThingWrapper = e.ThingWrapper;
            ThingsListItemControl NewThingsListItemControl = new ThingsListItemControl(ThingWrapper);
            NewThingsListItemControl.OnDelete += NewThingsListItemControl_OnDelete;
            ThingsListStackPanel.Children.Add(NewThingsListItemControl);
        }

        private void NewConnectionButton_Click(object sender, RoutedEventArgs e)
        {
            ThingsThingsManager.CreateThingWrapper();
        }
    }
}
