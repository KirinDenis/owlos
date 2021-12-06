using OWLOSThingsManager.EcosystemExplorer;
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
    /// Interaction logic for EcosystemManagerChildControl.xaml
    /// </summary>
    public partial class EcosystemManagerChildControl : UserControl, IEcosystemChildControl
    {
        public EcosystemControl parentControl { get; set; }
        public EcosystemManagerChildControl(Point possiton = default(Point), Point size = default(Point))
        {
            InitializeComponent();

            parentControl = new EcosystemControl(this, possiton, size);

            //Width = size.X;
            //Height = size.Y;
        }

        public void OnParentDrag()
        {
           // ThingPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSDanger"];
           // ThingShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"];
        }

        public void OnParentDrop()
        {
            //ThingPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
            //ThingShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"];
        }

        public void OnParentGetFocus()
        {
            //ThingPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
            //ThingShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"];
        }

        public void OnParentLostFocus()
        {
            //ThingPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
            //ThingShadowPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
        }



    }
}
