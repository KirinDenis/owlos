/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
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

using OWLOSAdmin.Ecosystem;
using OWLOSAdmin.Ecosystem.OWLOS;
using OWLOSAdmin.EcosystemExplorer.EcosystemControls;
using OWLOSAdmin.EcosystemExplorer.Huds;
using PathText;
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

            freeHeapPathBack.Data = HudLibrary.DrawArc(350, 350, radius - 20, 11, freeHeapAngelLimit);
            DrawFreeHeap(50);

            WiFiRSSIDPathBack.Data = HudLibrary.DrawArc(350, 350, radius - 40, 11, WiFiRSSIDAngelLimit);
            DrawWiFiRSSID(-50);

            PowerPathBack.Data = HudLibrary.DrawArc(350, 350, radius - 40, PowerAngeStart, PowerAngelLimit + PowerAngeStart);
            DrawPower(25000);

            //scriptsPath.Data = HudLibrary.DrawArc(350, 350, radius - 40, 185, 300);

            //script1Path.Data = HudLibrary.DrawArc(350, 350, radius - 60, 190, 210);
            //script2Path.Data = HudLibrary.DrawArc(350, 350, radius - 60, 215, 235);
            //script3Path.Data = HudLibrary.DrawArc(350, 350, radius - 60, 240, 260);

            

            //propertiesPath.Data = HudLibrary.DrawArc(350, 350, radius - 40, 317, 359);
            

        }

        

        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            PathTextControl _freeHeapText = new PathTextControl(350, 350, radius - 10, -7, 5, freeHeapText);
            PathTextControl _WifiRSSIDText = new PathTextControl(350, 350, radius - 30, -4, 5, WiFiRSSIDText);
            PathTextControl _PowerTextText = new PathTextControl(330, 350, radius - 15, PowerAngeStart-20, PowerAngeStart-5, PowerText);

            //Transport Hud over markers ONLINE ---
            Path transportOwerPathONLINE = new Path();
            transportOwerPathONLINE.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSSuccessAlpha2"];
            transportOwerPathONLINE.Data = HudLibrary.DrawArc(350, 350, radius - 100, 0, 90);
            transportOwerPathONLINE.StrokeThickness = 30;
            transportOwerPathONLINE.RenderTransformOrigin = new Point(0.5f, 0.5f);
            transportOwerPathONLINE.HorizontalAlignment = HorizontalAlignment.Center;
            transportOwerPathONLINE.VerticalAlignment = VerticalAlignment.Center;
            transportOwerPathONLINE.Width = 700;
            transportOwerPathONLINE.Height = 700;
            nodeGrid.Children.Add(transportOwerPathONLINE);

            TextBlock transportTextONLINE = new TextBlock();
            transportTextONLINE.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSSuccess"];
            transportTextONLINE.HorizontalAlignment = HorizontalAlignment.Left;
            transportTextONLINE.VerticalAlignment = VerticalAlignment.Top;
            transportTextONLINE.FontSize = 12;
            transportTextONLINE.Text = "online";
            nodeGrid.Children.Add(transportTextONLINE);

            PathTextControl pathTransportTextONLINE = new PathTextControl(350, 350, radius - 120, -7, 5, transportTextONLINE);

            //Transport Hud over markers OFFLINE ---
            Path transportOwerPathOFFLINE = new Path();
            transportOwerPathOFFLINE.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"];
            transportOwerPathOFFLINE.Data = HudLibrary.DrawArc(350, 350, radius - 100, 90, 180);
            transportOwerPathOFFLINE.StrokeThickness = 30;
            transportOwerPathOFFLINE.RenderTransformOrigin = new Point(0.5f, 0.5f);
            transportOwerPathOFFLINE.HorizontalAlignment = HorizontalAlignment.Center;
            transportOwerPathOFFLINE.VerticalAlignment = VerticalAlignment.Center;
            transportOwerPathOFFLINE.Width = 700;
            transportOwerPathOFFLINE.Height = 700;
            nodeGrid.Children.Add(transportOwerPathOFFLINE);

            TextBlock transportTextOFFLINE = new TextBlock();
            transportTextOFFLINE.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
            transportTextOFFLINE.HorizontalAlignment = HorizontalAlignment.Left;
            transportTextOFFLINE.VerticalAlignment = VerticalAlignment.Top;
            transportTextOFFLINE.FontSize = 12;
            transportTextOFFLINE.Text = "offline";
            nodeGrid.Children.Add(transportTextOFFLINE);

            PathTextControl pathTransportTextOFFLINE = new PathTextControl(350, 350, radius - 120, 90-7, 5, transportTextOFFLINE);
            


            //Transport Hud over markers RECONNECT ---
            Path transportOwerPathRECONNECT = new Path();
            transportOwerPathRECONNECT.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha2"];
            transportOwerPathRECONNECT.Data = HudLibrary.DrawArc(350, 350, radius - 100, 180, 270);
            transportOwerPathRECONNECT.StrokeThickness = 30;
            transportOwerPathRECONNECT.RenderTransformOrigin = new Point(0.5f, 0.5f);
            transportOwerPathRECONNECT.HorizontalAlignment = HorizontalAlignment.Center;
            transportOwerPathRECONNECT.VerticalAlignment = VerticalAlignment.Center;
            transportOwerPathRECONNECT.Width = 700;
            transportOwerPathRECONNECT.Height = 700;
            nodeGrid.Children.Add(transportOwerPathRECONNECT);

            TextBlock transportTextRECONNECT = new TextBlock();
            transportTextRECONNECT.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSSecondary"];
            transportTextRECONNECT.HorizontalAlignment = HorizontalAlignment.Left;
            transportTextRECONNECT.VerticalAlignment = VerticalAlignment.Top;
            transportTextRECONNECT.FontSize = 12;
            transportTextRECONNECT.Text = "reconnect";
            nodeGrid.Children.Add(transportTextRECONNECT);

            PathTextControl pathTransportTextRECONNECT = new PathTextControl(350, 350, radius - 120, 180 - 7, 5, transportTextRECONNECT);


            //Transport Hud over markers ERROR ---
            Path transportOwerPathERROR = new Path();
            transportOwerPathERROR.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"];
            transportOwerPathERROR.Data = HudLibrary.DrawArc(350, 350, radius - 100, 270, 359);
            transportOwerPathERROR.StrokeThickness = 30;
            transportOwerPathERROR.RenderTransformOrigin = new Point(0.5f, 0.5f);
            transportOwerPathERROR.HorizontalAlignment = HorizontalAlignment.Center;
            transportOwerPathERROR.VerticalAlignment = VerticalAlignment.Center;
            transportOwerPathERROR.Width = 700;
            transportOwerPathERROR.Height = 700;
            nodeGrid.Children.Add(transportOwerPathERROR);

            TextBlock transportTextERROR = new TextBlock();
            transportTextERROR.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSDanger"];
            transportTextERROR.HorizontalAlignment = HorizontalAlignment.Left;
            transportTextERROR.VerticalAlignment = VerticalAlignment.Top;
            transportTextERROR.FontSize = 12;
            transportTextERROR.Text = "error";
            nodeGrid.Children.Add(transportTextERROR);

            PathTextControl pathTransportTextERROR = new PathTextControl(350, 350, radius - 120, 270 - 7, 5, transportTextERROR);
            //--- ENDOF transport hud over 


            double trasnportPathStep = 4.0f;
            if (nodeWrapper.node != null)
            {                
                if (nodeWrapper.node.transports.Count > 0)
                {                   
                    double oneTransportAngel = (360 / 4) / nodeWrapper.node.transports.Count - trasnportPathStep;
                    for (int i=0; i < nodeWrapper.node.transports.Count; i ++)
                    {
                        double nextAngel = i * (oneTransportAngel + trasnportPathStep);
                        nodeGrid.Children.Add(new OWLOSNodeTransportControl(this, nodeWrapper.node.transports[i], radius - 100, nextAngel, oneTransportAngel));
                    }
                }
            }

            nodeGrid.Children.Add( new OWLOSNodeFileControl(this, nodeWrapper.node.files, radius - 40, 270, 45));

            //PathTextControl _propertiesText = new PathTextControl(350, 350, radius - 10, 325, 250, propertiesText);
            //PathTextControl _filesText = new PathTextControl(350, 350, radius - 10, 296, 250, filesText);
            //PathTextControl _scriptsText = new PathTextControl(350, 350, radius - 10, 180, 250, scriptsText);

            //PathTextControl _script1Text = new PathTextControl(350, 350, radius - 55, 187, 250, script1Text);
            //PathTextControl _script2Text = new PathTextControl(350, 350, radius - 55, 212, 250, script2Text);
            //PathTextControl _script3Text = new PathTextControl(350, 350, radius - 55, 237, 250, script3Text);

        }

        private void DrawFreeHeap(int value)
        {
            double freeHeapPercent = value / (freeHeapLimit / 100);
            double freeHeapAngel = (freeHeapAngelLimit / 100) * freeHeapPercent;
            freeHeapPath.Data = HudLibrary.DrawArc(350, 350,  radius - 20, 11, freeHeapAngel);
        }

        private void DrawWiFiRSSID(int value)
        {
            value = value * -1;
            double WiFiRSSIDPercent = value / (WiFiRSSIDLimit / 100);
            double WiFiRSSIDAngel = (WiFiRSSIDAngelLimit / 100) * WiFiRSSIDPercent;
            WiFiRSSIDPath.Data = HudLibrary.DrawArc(350, 350, radius - 40, 11, WiFiRSSIDAngel);
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
                OWLOSNodeDriverControl _OWLOSNodeDriverControl = new OWLOSNodeDriverControl(this, e.driver, radius + 25, driversCount * 30, 25);
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
            nodeShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"];
        }

        public void OnParentDrop()
        {
            nodePath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
            nodeShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"];
        }

        public void OnParentGetFocus()
        {
            nodePath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
            nodeShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"];
        }

        public void OnParentLostFocus()
        {
            nodePath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
            nodeShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
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
