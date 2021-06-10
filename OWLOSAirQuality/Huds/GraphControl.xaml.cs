/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Sergii Karpeko
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

using OWLOSAdmin.EcosystemExplorer.Huds;
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    /// <summary>
    /// Interaction logic for GraphControl.xaml
    /// </summary>
    public partial class GraphControl : UserControl
    {
        private double[] _data = null;
        public double[] data
        {
            get => _data;
            set
            {
                if ((value != null) && (value.Length > 0))
                {
                    _data = value;
                    Draw();
                }
            }
        }

        private double _angle = 0.0f;
        private readonly double _length = 180.0f;

        public double angle
        {
            get => _angle;
            set
            {
                if ((value > -1) && (value < 360))
                {
                    _angle = value;
                    // Draw();
                }
            }
        }

        private List<Rectangle> rays = null;

        public double rayWidth = 5.0f;

        public double raysStep = 0.5f;

        public int raysAnimationSpeed = 2000;

        public Color ColorGradient1 = (App.Current.Resources["OWLOSPrimaryAlpha1"] as SolidColorBrush).Color; 

        public Color ColorGradient2 = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;


        public GraphControl()
        {
            InitializeComponent();
        }

        private void Draw()
        {
            
            if (rays == null)
            {
                GraphGrid.Children.Clear();
                rays = new List<Rectangle>();

                for (int i = 0; i < data.Length; i++)
                {
                    Rectangle r = new Rectangle
                    {
                        Width = rayWidth,
                        Height = 1.0f,
                        Tag = (double)-1.0f,
                        HorizontalAlignment = HorizontalAlignment.Center,
                        VerticalAlignment = VerticalAlignment.Center,

                        //currentColor.A -= (byte)(i * 5);
                        //Fill = new SolidColorBrush(currentColor)
                        Fill = new LinearGradientBrush(ColorGradient1, ColorGradient2, new Point(0.5, 0), new Point(0.5, 1))
                    };

                    double x;
                    double y;

                    double angel = (i / raysStep + _angle) * (Math.PI / 180) - Math.PI / 2.0f;

                    x = (Gold.radius + data[i] / 2.0f + 0.0f) * Math.Cos(angel) + 7.0f;
                    y = (Gold.radius + data[i] / 2.0f + 0.0f) * Math.Sin(angel) + 0.0f;

                    TransformGroup group = new TransformGroup();

                    RotateTransform rt = new RotateTransform();

                    TranslateTransform tt = new TranslateTransform
                    {
                        X = x,
                        Y = y
                    };

                    DoubleAnimation scaleAnimation = new DoubleAnimation()
                    {
                        From = (double)r.Tag,
                        To = -data[i],
                        Duration = new Duration(TimeSpan.FromMilliseconds(raysAnimationSpeed)),                    
                    };

                    r.Tag = -data[i];
                    ScaleTransform sc = new ScaleTransform();
                    sc.BeginAnimation(ScaleTransform.ScaleYProperty, scaleAnimation);

                    group.Children.Add(sc);
                    group.Children.Add(rt);
                    group.Children.Add(tt);
                    rt.Angle += (angel / (Math.PI / 180.0f)) + 90.0f;
                    r.RenderTransform = group;
                    
                    rays.Add(r);
                    GraphGrid.Children.Add(rays[i]);
                }
            }
            else
            {
                for (int i = 0; i < data.Length; i++)
                {
                    TransformGroup group = rays[i].RenderTransform as TransformGroup;
                    ScaleTransform sc = group.Children[0] as ScaleTransform;
                   
                    DoubleAnimation scaleAnimation = new DoubleAnimation()
                    {
                        From = (double)rays[i].Tag,
                        To = -data[i],
                        Duration = new Duration(TimeSpan.FromMilliseconds(raysAnimationSpeed)),                        
                        
                    };
                    
                    rays[i].Tag = -data[i];                    
                    sc.BeginAnimation(ScaleTransform.ScaleYProperty, scaleAnimation);
                }
            }
        }
    }
}
