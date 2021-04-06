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

using OWLOSThingsManager.Ecosystem.OWLOS;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace OWLOSThingsManager.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for ThingConnectionConfigItemControl.xaml
    /// </summary>
    public partial class ThingConnectionConfigItemControl : UserControl
    {
        private readonly OWLOSThing Thing;
        private readonly OWLOSTransport ThingTransport;

        private readonly int logCount;

        private readonly LogControl OutLogControl;
        private readonly LogControl InLogControl;
        public ThingConnectionConfigItemControl(OWLOSThing Thing, OWLOSTransport ThingTransport)
        {
            InitializeComponent();
            this.Thing = Thing;
            this.ThingTransport = ThingTransport;
           
            EnabledCheckBox.IsChecked = ThingTransport.connection.enable;
            NameTextBox.Text = ThingTransport.connection.name;
            TypeComboBox.SelectedIndex = (int)ThingTransport.connection.connectionType;
            ConnectionStringTextBox.Text = ThingTransport.connection.connectionString;

            ThingTransport.OnTransportStatusChanger += ThingTransport_OnTransportStatusChanger;
            ThingTransport.OnLogItem += ThingTransport_OnLogItem;

            OutLogControl = new LogControl();
            OutLogControl.SetValue(Grid.ColumnProperty, 0);
            OutLogControl.SetValue(Grid.RowProperty, 1);
            LogGrid.Children.Add(OutLogControl);

            InLogControl = new LogControl();
            InLogControl.SetValue(Grid.ColumnProperty, 1);
            InLogControl.SetValue(Grid.RowProperty, 1);
            LogGrid.Children.Add(InLogControl);
        }

        private void ThingTransport_OnLogItem(object sender, LogItem e)
        {

            base.Dispatcher.Invoke(() =>
            {
                if (LogGrid.Visibility == Visibility.Visible)
                {
                    if (e.isSend)
                    {
                        switch (e.networkStatus)
                        {
                            case NetworkStatus.Online:

                                OutLogControl.AddToLog(e.text, 0);
                                break;

                            case NetworkStatus.Offline:
                                OutLogControl.AddToLog(e.text, 1);
                                break;

                            case NetworkStatus.Reconnect:
                                OutLogControl.AddToLog(e.text, 2);
                                break;

                            case NetworkStatus.Erorr:
                                OutLogControl.AddToLog(e.text, 3);
                                break;
                        }
                    }
                    else
                    {
                        InLogControl.AddToLog(e.text, 2);
                    }
                }

            });

        }

        private void ThingTransport_OnTransportStatusChanger(object sender, NetworkStatus e)
        {
            base.Dispatcher.Invoke(() =>
            {

                switch (e)
                {
                    case NetworkStatus.Online:
                        StatusTextBlock.Text = "ONLINE";
                        StatusTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSuccess"]).Color);
                        break;
                    case NetworkStatus.Offline:
                        StatusTextBlock.Text = "OFFLINE";
                        StatusTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                        break;

                    case NetworkStatus.Reconnect:
                        StatusTextBlock.Text = "RECONNECT";
                        StatusTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSPrimary"]).Color);
                        break;

                    case NetworkStatus.Erorr:
                        StatusTextBlock.Text = "ERROR";
                        StatusTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color);
                        break;
                }

                SendTextBlock.Text = "send: " + ThingTransport.totlaSend.ToString();
                RecvTextBlock.Text = "recv: " + ThingTransport.totlaRecv.ToString();
            });
        }

        private void LogViewButton_Click(object sender, RoutedEventArgs e)
        {
            if (LogGrid.Visibility != Visibility.Visible)
            {
                LogViewButton.Content = "Hide log";
                LogGrid.Visibility = Visibility.Visible;
                GridLength NewGridLength; 
                if (MainGrid.RowDefinitions[1].Tag != null)
                {
                    NewGridLength = (GridLength)MainGrid.RowDefinitions[1].Tag;
                }
                else
                {
                    NewGridLength = new GridLength(350.0f);
                }
                
                MainGrid.RowDefinitions[1].Height = NewGridLength;
                LogGridSplitter.Visibility = Visibility.Visible;
            }
            else
            {
                LogViewButton.Content = "Show log";
                MainGrid.RowDefinitions[1].Tag = MainGrid.RowDefinitions[1].Height;
                MainGrid.RowDefinitions[1].Height = new GridLength(0, GridUnitType.Auto);

                LogGrid.Visibility = Visibility.Collapsed;
                LogGridSplitter.Visibility = Visibility.Hidden;
            }
        }
    }
}
