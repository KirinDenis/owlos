using OWLOSAirQuality.Frames;
using System.Windows;

namespace OWLOSAirQuality
{
    public partial class SingleAirQualityMainWindow : Window
    {
        private Point ResizePosition;
        public SingleAirQualityMainWindow()
        {
            InitializeComponent();

            ValueFrame valueFrame = new ValueFrame();
            valueFrame.MainGrid.Children.Remove(valueFrame.ValueHolderGrid);
            valueFrame.Close();
            MainGrid.Children.Add(valueFrame.ValueHolderGrid);

        }

        private void Canvas_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {

            ResizePosition = e.GetPosition(this);
        }

        private void Canvas_PreviewMouseMove(object sender, System.Windows.Input.MouseEventArgs e)
        {
            if (e.LeftButton == System.Windows.Input.MouseButtonState.Pressed)
            {
                Point currentPosition = e.GetPosition(this);

                Width += currentPosition.X - ResizePosition.X;
                Height += currentPosition.Y - ResizePosition.Y;

                positin.Text = Width + ":" + Height + " -- " + ResizePosition.X + ":" + ResizePosition.Y;

            }
        }

        private void viewbox_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            this.DragMove();
        }
    }
}
