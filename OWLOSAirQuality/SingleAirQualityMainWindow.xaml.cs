using OWLOSAirQuality.Frames;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;

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

        private void CloseTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            Close();
        }

        private void MNTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (this.WindowState == WindowState.Maximized)
            {
                this.WindowState = WindowState.Normal;
            }
            else
            {
                this.WindowState = WindowState.Maximized;
            }
        }

        private void HideTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (this.WindowState != WindowState.Minimized)
            {
                this.WindowState = WindowState.Minimized;
            }
            else
            {
                this.WindowState = WindowState.Maximized;
            }
        }

        private void Grid_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (e.ClickCount == 2)
            {
                MNTextBlock_MouseDown(null, null);
            }
        }

        private void TransparentTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if ((sender as TextBlock).Tag == null)
            {
                (sender as TextBlock).Tag = true;
                GeneralGrid.Background = (SolidColorBrush)App.Current.Resources["OWLOSDarkAlpha2"];
            }
            else
            {
                (sender as TextBlock).Tag = null;
                GeneralGrid.Background = (SolidColorBrush)App.Current.Resources["OWLOSDark"];
            }
        }

        private void GeneralGrid_PreviewMouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            this.DragMove();
        }

        private void Grid_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            try
            {
                this.DragMove();
            }
            catch { }
        }

        private void TransparentTextBlock_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha3"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void TransparentTextBlock_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        private void HideTextBlock_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha3"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void HideTextBlock_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha2"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        private void CloseTextBlock_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha3"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);

        }

        private void CloseTextBlock_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha2"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Background = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Background).Color);
            (sender as TextBlock).Background.BeginAnimation(SolidColorBrush.ColorProperty, animation);
        }

        private void TopMostTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            this.Topmost = !this.Topmost;
        }
    }
}
