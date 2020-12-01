using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.EcosystemExplorer.EcosystemControls;
using OWLOSAdmin.EcosystemExplorer.Huds;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.Timers;
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

namespace OWLOSAdmin.EcosystemExplorer
{
    /// <summary>
    /// Interaction logic for OWLOSNodeControl.xaml
    /// </summary>
    public partial class OWLOSNodeControl : UserControl, IEcosystemChildControl
    {

        public EcosystemControl parentControl { get; set; }

        private double radius = 300;
        private double angel1 = 0;

        private OWLOSNodeWrapper nodeWrapper;

        public int driversCount = 0;

        private DependencyPropertyDescriptor renderTransform = DependencyPropertyDescriptor.FromProperty(RenderTransformProperty, typeof(UserControl));

        private double freeHeapLimit = 250000; //ESP32 - todo 
        private double freeHeapAngelLimit = 180;

        private double WiFiRSSIDLimit = 120;  //-() db
        private double WiFiRSSIDAngelLimit = 90;

        private double PowerLimit = 65535; //chack for ESP32
        private double PowerAngelLimit = 75;
        private double PowerAngeStart = 105;


        public OWLOSNodeControl(OWLOSNodeWrapper nodeWrapper)
        {

            this.nodeWrapper = nodeWrapper;
            if (nodeWrapper != null)
            {
                nodeWrapper.node.OnNewDriver += Node_OnNewDriver;
            }

            InitializeComponent();

            parentControl = new EcosystemControl(this);

            nodeShadowPath.Data =
            nodePath.Data = HudLibrary.DrawArc(350, 350, radius, 0, 359);
            insideNodePath.Data = HudLibrary.DrawArc(350, 350, radius-80, 0, 359);
            insideNodePath2.Data = HudLibrary.DrawArc(350, 350, radius - 120, 0, 359);

            freeHeapPathBack.Data = HudLibrary.DrawArc(350, 350, radius - 20, 0, freeHeapAngelLimit);
            DrawFreeHeap(50);

            WiFiRSSIDPathBack.Data = HudLibrary.DrawArc(350, 350, radius - 40, 0, WiFiRSSIDAngelLimit);
            DrawWiFiRSSID(-50);

            PowerPathBack.Data = HudLibrary.DrawArc(350, 350, radius - 40, PowerAngeStart, PowerAngelLimit + PowerAngeStart);
            DrawPower(25000);

            scriptsPath.Data = HudLibrary.DrawArc(350, 350, radius - 40, 185, 300);

            script1Path.Data = HudLibrary.DrawArc(350, 350, radius - 60, 190, 210);
            script2Path.Data = HudLibrary.DrawArc(350, 350, radius - 60, 215, 235);
            script3Path.Data = HudLibrary.DrawArc(350, 350, radius - 60, 240, 260);

            filesPath.Data = HudLibrary.DrawArc(350, 350, radius - 40, 302, 315);

            propertiesPath.Data = HudLibrary.DrawArc(350, 350, radius - 40, 317, 359);
            restFullPath.Data = HudLibrary.DrawArc(350, 350, radius - 100, 0, 40);
            MQTTPath.Data = HudLibrary.DrawArc(350, 350, radius - 100, 45, 85);
            UARTPath.Data = HudLibrary.DrawArc(350, 350, radius - 100, 90, 130);

            //RalationLines test 
            /*
            DoubleAnimation rotate = new DoubleAnimation
            {
                From = 0.0f,
                To = 360.0f,
                Duration = new Duration(TimeSpan.FromMilliseconds(10000)),
                RepeatBehavior = RepeatBehavior.Forever,
                EasingFunction = new BackEase()
                //AutoReverse = true
            };
            RotateTransform rotateTransform = new RotateTransform();
            this.RenderTransform = rotateTransform;
            rotateTransform.BeginAnimation(RotateTransform.AngleProperty, rotate);
            renderTransform.AddValueChanged(this, PositionChanged);
            //nodeGrid.RenderTransform.Add
            */


        }

        private void DrawFreeHeap(int value)
        {
            double freeHeapPercent = value / (freeHeapLimit / 100);
            double freeHeapAngel = (freeHeapAngelLimit / 100) * freeHeapPercent;
            freeHeapPath.Data = HudLibrary.DrawArc(350, 350, radius - 20, 0, freeHeapAngel);
        }

        private void DrawWiFiRSSID(int value)
        {
            value = value * -1;
            double WiFiRSSIDPercent = value / (WiFiRSSIDLimit / 100);
            double WiFiRSSIDAngel = (WiFiRSSIDAngelLimit / 100) * WiFiRSSIDPercent;
            WiFiRSSIDPath.Data = HudLibrary.DrawArc(350, 350, radius - 40, 0, WiFiRSSIDAngel);
        }

        private void DrawPower(int value)
        {            
            double PowerPercent = value / (PowerLimit / 100);
            double PowerAngel = (PowerAngelLimit / 100) * PowerPercent;
            PowerPath.Data = HudLibrary.DrawArc(350, 350, radius - 40, PowerAngeStart, PowerAngel + PowerAngeStart);
        }


        private void PositionChanged(object sender, EventArgs e)
        {
            parentControl.EcosystemControlPositionChanged(sender, e);

        }

        private void Node_OnNewDriver(object sender, Ecosystem.OWLOS.OWLOSDriverWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                if (e.driver.name.Equals("esp"))
                {
                    e.driver.OnPropertyCreate += ESPDriver_OnPropertyCreate;
                }
                else
                if (e.driver.name.Equals("wifi"))
                {
                    e.driver.OnPropertyCreate += WiFiDriver_OnPropertyCreate;
                }
                OWLOSNodeDriverControl _OWLOSNodeDriverControl = new OWLOSNodeDriverControl(this, e.driver, radius + 25, driversCount);
                driversCount++;
                nodeGrid.Children.Add(_OWLOSNodeDriverControl);
            });

        }

        private void ESPDriver_OnPropertyCreate(object sender, Ecosystem.OWLOS.OWLOSPropertyWrapperEventArgs e)
        {

            if (e.property.name.Equals("espfreeheap"))
            {
                e.property.OnPropertyChange += ESPRAMProperty_OnPropertyChange;
            }
            else
            if (e.property.name.Equals("espvcc"))
            {
                e.property.OnPropertyChange += ESPVCCProperty_OnPropertyChange;
            }
        }

        private void WiFiDriver_OnPropertyCreate(object sender, Ecosystem.OWLOS.OWLOSPropertyWrapperEventArgs e)
        {

            if (e.property.name.Equals("wifirssi"))
            {
                e.property.OnPropertyChange += WiFiRSSIDProperty_OnPropertyChange;
            }
        }


        private void ESPRAMProperty_OnPropertyChange(object sender, Ecosystem.OWLOS.OWLOSPropertyWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {

                DrawFreeHeap(int.Parse(e.property.value));
            }
                );

        }

        private void ESPVCCProperty_OnPropertyChange(object sender, Ecosystem.OWLOS.OWLOSPropertyWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {

                DrawPower(int.Parse(e.property.value));
            }
                );

        }


        private void WiFiRSSIDProperty_OnPropertyChange(object sender, Ecosystem.OWLOS.OWLOSPropertyWrapperEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {

                DrawWiFiRSSID(int.Parse(e.property.value));
            }
                );

        }

        public void OnParentDrag()
        {
            nodePath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSDanger"];
        }

        public void OnParentDrop()
        {
            nodePath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
        }

        public void OnParentGetFocus()
        {
            nodePath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
        }

        public void OnParentLostFocus()
        {
            nodePath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
        }

        private async void OnLifeCycleTimer(Object source, ElapsedEventArgs e)
        {
        }



        /*
        private void path5_MouseEnter(object sender, MouseEventArgs e)
        {

        }
        */

        private void path5_MouseLeave(object sender, MouseEventArgs e)
        {

        }

    }
}
