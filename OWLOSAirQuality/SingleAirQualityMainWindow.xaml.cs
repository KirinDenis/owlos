/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
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
            if (WindowState == WindowState.Maximized)
            {
                WindowState = WindowState.Normal;
            }
            else
            {
                WindowState = WindowState.Maximized;
            }
        }

        private void HideTextBlock_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (WindowState != WindowState.Minimized)
            {
                WindowState = WindowState.Minimized;
            }
            else
            {
                WindowState = WindowState.Maximized;
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
            DragMove();
        }

        private void Grid_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            try
            {
                DragMove();
            }
            catch { }
        }

        private void TransparentTextBlock_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha3"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
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
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
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
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
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
            Topmost = !Topmost;
        }
    }
}
