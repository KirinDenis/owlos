using OWLOSAdmin.EcosystemExplorer.Huds;
using OWLOSThingsManager.EcosystemExplorer.Huds;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    /// <summary>
    /// Interaction logic for EcosystemServerConnectionHudControl.xaml
    /// </summary>
    public partial class EcosystemServiceConnectionHudControl : UserControl
    {
        private readonly Path ThingShadowPath;
        private readonly Path ThingPath;

        private readonly Path insideThingPath;
        private readonly Path insideThingPath2;
        private readonly Path freeHeapPathBack;

        public EcosystemServiceConnectionHudControl()
        {
            InitializeComponent();

            ThingShadowPath = new Path();
            ThingPath = new Path();

            insideThingPath = new Path();
            insideThingPath2 = new Path();
            freeHeapPathBack = new Path();

            ThingShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSPrimaryAlpha2"];
            ThingPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSPrimary"];

            insideThingPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSSecondary"];
            insideThingPath2.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSPrimaryAlpha2"];
            freeHeapPathBack.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSPrimary"];

            HudGrid.Children.Add(ThingShadowPath);
            HudGrid.Children.Add(ThingPath);


            HudGrid.Children.Add(insideThingPath);
            HudGrid.Children.Add(insideThingPath2);
            HudGrid.Children.Add(freeHeapPathBack);

            ThingShadowPath.Data = ThingPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius, 0, 359);
            ThingShadowPath.StrokeThickness = ThingPath.StrokeThickness = 4;


            insideThingPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius3, 0, 359);
            insideThingPath2.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius2, 0, 359);
            freeHeapPathBack.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - Gold.radius5, 11, 200);
            freeHeapPathBack.StrokeThickness = Gold.radius8;


        }
    }
}
