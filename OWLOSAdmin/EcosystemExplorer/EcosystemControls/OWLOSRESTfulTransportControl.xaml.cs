/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
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

using OWLOSThingsManager.Ecosystem.OWLOS;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace OWLOSThingsManager.EcosystemExplorer.EcosystemControls
{
    /// <summary>
    /// Interaction logic for OWLOSRESTfulTransportControl.xaml
    /// </summary>
    public partial class OWLOSRESTfulTransportControl : UserControl
    {
        private readonly RESTfulClientTransport transport;

        private readonly OWLOSLogPanelControl logPanel;
        private readonly OWLOSLogPanelControl recvLogPanel;

        public OWLOSRESTfulTransportControl(IOWLOSTransport transport)
        {
            InitializeComponent();

            this.transport = transport as RESTfulClientTransport;
            this.transport.OnTransportStatusChanger += Transport_OnTransportStatusChanger;
            this.transport.OnLogItem += Transport_OnLogItem;

            enabledCheckbox.IsChecked = this.transport.connection.enable;
            nameText.Text = this.transport.connection.name;
            hostText.Text = this.transport._RESTfulClientConnectionDTO.host;
          //  portText.Text = this.transport._RESTfulClientConnectionDTO.port.ToString();

            logGrid.Children.Add(logPanel = new OWLOSLogPanelControl());
            recvLogGrid.Children.Add(recvLogPanel = new OWLOSLogPanelControl());
        }

        private void Transport_OnLogItem(object sender, LogItem e)
        {
            base.Dispatcher.Invoke(() =>
            {

                if (e.isSend)
                {
                    switch (e.networkStatus)
                    {
                        case NetworkStatus.Online:

                            logPanel.AddToLog(e.text, 0);
                            break;

                        case NetworkStatus.Offline:
                            logPanel.AddToLog(e.text, 1);
                            break;

                        case NetworkStatus.Reconnect:
                            logPanel.AddToLog(e.text, 2);
                            break;

                        case NetworkStatus.Erorr:
                            logPanel.AddToLog(e.text, 3);
                            break;
                    }
                }
                else
                {
                    recvLogPanel.AddToLog(e.text, 2);
                }

            });
        }

        private void Transport_OnTransportStatusChanger(object sender, NetworkStatus e)
        {
            base.Dispatcher.Invoke(() =>
            {

                switch (e)
                {
                    case NetworkStatus.Online:
                        networkStatuText.Text = "ONLINE";
                        networkStatuText.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSuccess"]).Color);
                        break;
                    case NetworkStatus.Offline:
                        networkStatuText.Text = "OFFLINE";
                        networkStatuText.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                        break;

                    case NetworkStatus.Reconnect:
                        networkStatuText.Text = "RECONNECT";
                        networkStatuText.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSPrimary"]).Color);
                        break;

                    case NetworkStatus.Erorr:
                        networkStatuText.Text = "ERROR";
                        networkStatuText.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color);
                        break;
                }

                send_Text.Text = transport.totlaSend.ToString();
                recv_Text.Text = transport.totlaRecv.ToString();
            });
        }

        private void enabledCheckbox_Checked(object sender, RoutedEventArgs e)
        {
            if (transport != null)
            {
                transport.connection.enable = enabledCheckbox.IsChecked.Value;
            }
        }


    }
}
