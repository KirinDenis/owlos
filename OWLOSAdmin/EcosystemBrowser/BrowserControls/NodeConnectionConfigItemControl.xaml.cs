﻿using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for NodeConnectionConfigItemControl.xaml
    /// </summary>
    public partial class NodeConnectionConfigItemControl : UserControl
    {
        private OWLOSNode Node;
        private OWLOSTransport NodeTransport;

        private int logCount;

        private LogControl OutLogControl;
        private LogControl InLogControl;
        public NodeConnectionConfigItemControl(OWLOSNode Node, OWLOSTransport NodeTransport)
        {
            InitializeComponent();
            this.Node = Node;
            this.NodeTransport = NodeTransport;
           
            EnabledCheckBox.IsChecked = NodeTransport.connection.enable;
            NameTextBox.Text = NodeTransport.connection.name;
            TypeComboBox.SelectedIndex = (int)NodeTransport.connection.connectionType;
            ConnectionStringTextBox.Text = NodeTransport.connection.connectionString;

            NodeTransport.OnTransportStatusChanger += NodeTransport_OnTransportStatusChanger;
            NodeTransport.OnLogItem += NodeTransport_OnLogItem;

            OutLogControl = new LogControl();
            OutLogControl.SetValue(Grid.ColumnProperty, 0);
            OutLogControl.SetValue(Grid.RowProperty, 1);
            LogGrid.Children.Add(OutLogControl);

            InLogControl = new LogControl();
            InLogControl.SetValue(Grid.ColumnProperty, 1);
            InLogControl.SetValue(Grid.RowProperty, 1);
            LogGrid.Children.Add(InLogControl);
        }

        private void NodeTransport_OnLogItem(object sender, LogItem e)
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

        private void NodeTransport_OnTransportStatusChanger(object sender, NetworkStatus e)
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

                SendTextBlock.Text = "send: " + NodeTransport.totlaSend.ToString();
                RecvTextBlock.Text = "recv: " + NodeTransport.totlaRecv.ToString();
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
