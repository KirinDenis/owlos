using OWLOSAdmin.EcosystemExplorer.EcosystemControls;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace OWLOSAdmin.EcosystemExplorer
{
    /// <summary>
    /// Interaction logic for LogControl.xaml
    /// </summary>
    public partial class OWLOSPanelControl : UserControl, IEcosystemChildControl
    {
        public EcosystemControl parentControl { get; set; }

        

        public OWLOSPanelControl()
        {
            InitializeComponent();

            parentControl = new EcosystemControl(this);
        }

        public void OnParentGetFocus()
        {
            mainBorder.BorderBrush = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
        }

        public void OnParentLostFocus()
        {
            mainBorder.BorderBrush = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha3"];
        }

        public void OnParentDrag()
        {
            //
        }

        public void OnParentDrop()
        {
            //
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            OWLOSWindow window = new OWLOSWindow();
            (parentControl.Parent as Grid).Children.Remove(parentControl);
            parentControl.RenderTransform = null;
            parentControl.HorizontalAlignment = HorizontalAlignment.Stretch;
            parentControl.VerticalAlignment = VerticalAlignment.Stretch;
            window.MainGrid.Children.Add(parentControl);
            parentControl.Show();
            window.Show();
        }
    }
}
