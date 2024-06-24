/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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

using System.Windows.Controls;

namespace OWLOSThingsManager.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for ThingControl.xaml
    /// </summary>
    public partial class ThingControl : UserControl
    {
        public PanelControl ThingPanelControl;

        private readonly PanelControlTag PanelTag;

        public ThingControl(PanelControlTag PanelTag)
        {
            InitializeComponent();
            this.PanelTag = PanelTag;

            ThingPanelControl = new PanelControl(PanelTag);
            ThingPanelControl.ContentHolder.Children.Add(this);

            if (PanelTag.Thing.Features != null)
            {
                if (!string.IsNullOrEmpty(PanelTag.Thing.Features.Board))
                {
                    BoardTextBlock.Text = PanelTag.Thing.Features.Board;
                }

                if (!string.IsNullOrEmpty(PanelTag.Thing.Features.Version))
                {
                    VersionBuildTextBlock.Text = string.Format("OWLOS firmaware version: {0} (build: {1})", PanelTag.Thing.Features.Version, PanelTag.Thing.Features.Build);
                }

                if (!string.IsNullOrEmpty(PanelTag.Thing.Features.Debug))
                {
                    DebugTextBlock.Text = string.Format("Debug: {0}", PanelTag.Thing.Features.Debug);
                }

                if (!string.IsNullOrEmpty(PanelTag.Thing.Features.Log))
                {
                    LogTextBlock.Text = string.Format("Log: {0}", PanelTag.Thing.Features.Log);
                }


            }
        }
    }
}
