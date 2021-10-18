/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
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

using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace OWLOSThingsManager.EcosystemExplorer
{
    public struct PathLine
    {
        public PathFigure Figure { get; set; }
        public PointCollection PointCollection { get; set; }
        public PathLine(PathFigure figure)
        {
            Figure = figure;
            PointCollection = ((PolyBezierSegment)figure.Segments[0]).Points;
        }
    }
    public class RelationLineControl
    {
        private PathLine pathLine;
        private FrameworkElement aControl;
        private FrameworkElement bControl;
        private FrameworkElement frameworkElement;
        private Panel panel;
        private Ellipse ellipse;
        public Path curveLine;
        private Grid Parent;
        private bool IsDisposed = false;
        private readonly Point[] offsetA = new Point[2];
        private readonly Point[] offsetB = new Point[2];
        public double ellipseWidth = 10;
        public double ellipseHeight = 10;
        private readonly TranslateTransform transform = new TranslateTransform();
        public Thickness? margin;
        public RelationLineControl(Grid parent, FrameworkElement aWorldObjectControl, FrameworkElement bWorldObjectControl, FrameworkElement frameworkElement, Panel panel, Point[] offsetA = null, Point[] offsetB = null)
        {
            Parent = parent;
            aControl = aWorldObjectControl;
            bControl = bWorldObjectControl;
            this.frameworkElement = frameworkElement;
            this.panel = panel;

            if (offsetA != null && offsetA.Length == 2)
            {
                this.offsetA = offsetA;
            }
            else
            {
                this.offsetA[0] = new Point(0, ellipseHeight / 2);
                this.offsetA[1] = new Point(-120, 0);
            }

            if (offsetB != null && offsetB.Length == 2)
            {
                this.offsetB = offsetB;
            }
            else
            {
                this.offsetB[0] = new Point(0, 0);
                this.offsetB[1] = new Point(0, 0);
            }
        }
        public void Hide()
        {
            curveLine.Visibility = Visibility.Hidden;
        }
        public void Show()
        {
            curveLine.Visibility = Visibility.Visible;
        }
        public Path DrawCurveLine(FrameworkElement startElement, FrameworkElement relativeElement, FrameworkElement target, SolidColorBrush lineColor)
        {
            //Create curve line
            Point startPointA = startElement.TranslatePoint(new Point(0, 0), relativeElement);
            //Correct start point A           
            startPointA = new Point(startPointA.X + startElement.Width, startPointA.Y - startElement.Height / 2);
            //Set leveling for point B
            Point startPointB = new Point(startPointA.X + 100, startPointA.Y);
            //Do same for end point A & B
            Point endPointA = new Point(target.Margin.Left + target.ActualWidth + 50, target.Margin.Top + 125);
            Point endPointB = new Point(endPointA.X - 100, endPointA.Y);


            return CreateCurveLine(new[] { startPointA, startPointB, endPointB, endPointA }, lineColor);
        }
        private Path CreateCurveLine(Point[] points, SolidColorBrush lineColor)
        {
            // Create a Path to hold the geometry.
            Path path = new Path
            {
                CacheMode = null,
                Stroke = lineColor,
                StrokeThickness = 0.5f
            };
            // Add a PathGeometry.
            PathGeometry path_geometry = new PathGeometry();
            path.Data = path_geometry;

            // Create a PathFigure.
            PathFigure path_figure = new PathFigure();
            path_geometry.Figures.Add(path_figure);

            // Start at the first point.
            path_figure.StartPoint = points[0];

            // Create a PathSegmentCollection.
            PathSegmentCollection path_segment_collection = new PathSegmentCollection();
            path_figure.Segments = path_segment_collection;

            // Add the rest of the points to a PointCollection.
            PointCollection point_collection = new PointCollection(points.Length - 1);
            for (int i = 1; i < points.Length; i++)
            {
                point_collection.Add(points[i]);
            }

            // Make a PolyBezierSegment from the points.
            PolyBezierSegment bezier_segment = new PolyBezierSegment
            {
                Points = point_collection
            };

            // Add the PolyBezierSegment to other segment collection.
            path_segment_collection.Add(bezier_segment);
            return path;
        }
        public Point[] GetPositionFromTarget(FrameworkElement target, FrameworkElement relative, Point point1, Point point2, Point offsetA = default(Point), Point offsetB = default(Point))
        {
            Point[] points =
            {
                point1,
                point2
            };

            SetPoint(ref points, new UIElement[]
            {
                target, //Target
                relative //Relative
            });

            Point correctPointA = new Point(points[0].X + offsetA.X, points[0].Y + offsetA.Y);            
            Point correctPointB = new Point(points[1].X + offsetB.X, points[1].Y + offsetB.Y);            
            points[0] = correctPointA;
            points[1] = correctPointB;
            return points;
        }
        public void SetPoint(ref Point[] points, UIElement[] elements)
        {
            UIElement target = elements[0];
            Point newPoint = target.TranslatePoint(new Point(0, 0), elements[1]);
            points[0] = newPoint;
            double offsetX = newPoint.X - points[1].X;
            double offsetY = newPoint.Y - points[1].Y;
            Point oldPointB = points[1];
            Point newPointB = new Point(oldPointB.X + offsetX, oldPointB.Y + offsetY);
            points[1] = newPointB;
        }
        public Ellipse DrawPointer(FrameworkElement target, Thickness? margin, double width, double height, SolidColorBrush color)
        {         
            if (ellipse == null)
            {
                if (margin == null)
                {
                    ellipse = new Ellipse
                    {
                        VerticalAlignment = VerticalAlignment.Top,
                        HorizontalAlignment = HorizontalAlignment.Right,
                        Fill = color,
                        Width = width,
                        Height = height,
                        Margin = new Thickness(target.Margin.Left - 172.0f, target.Margin.Top, target.Margin.Right + 172.0f, target.Margin.Bottom)
                    };
                }
                else
                {
                    ellipse = new Ellipse
                    {
                        VerticalAlignment = VerticalAlignment.Top,
                        HorizontalAlignment = HorizontalAlignment.Left,
                        Fill = color,
                        Width = width / 4.0f,
                        Height = height / 4.0f,
                        Margin = (Thickness)margin
                    };
                }
            }
            return ellipse;
        }
        public bool DrawRelationLine(SolidColorBrush ellipseColor, SolidColorBrush lineColor)
        {
            if (IsDisposed)
            {
                throw new ObjectDisposedException("Can't get access to disposed object.");
            }

            if (ellipse != null)
            {
                return false;
            }

            if (curveLine != null)
            {
                return false;
            }

            ellipse = DrawPointer(aControl, margin, ellipseWidth, ellipseHeight, ellipseColor);
            Parent.Children.Add(ellipse);
            ellipse.UpdateLayout();

            curveLine = DrawCurveLine(ellipse, Parent, aControl, lineColor);
            ellipse.Tag = curveLine;         
            panel.Children.Insert(0, curveLine);
            curveLine.UpdateLayout();

            pathLine = new PathLine(((PathGeometry)curveLine.Data).Figures[0]);
            UpdatePositions();
            aControl.SizeChanged += Control_OnEventTriggered;
            bControl.SizeChanged += Control_OnEventTriggered;
            return true;
        }
        public void RemoveRelationLine()
        {
            if (IsDisposed)
            {
                throw new ObjectDisposedException("Can't get access to disposed object.");
            }
            Parent.Children.Remove(ellipse);
            panel.Children.Remove(curveLine);
        }
        public void Dispose()
        {
            if (IsDisposed)
            {
                throw new ObjectDisposedException("Can't get access to disposed object.");
            }
            IsDisposed = true;
            RemoveRelationLine();
            pathLine = default(PathLine);
            aControl = null;
            bControl = null;
            frameworkElement = null;
            panel = null;
            ellipse = null;
            curveLine = null;
            Parent = null;
        }
        private void Control_OnEventTriggered(object sender, EventArgs e)
        {
            UpdatePositions();
        }
        public void UpdatePositions()
        {
            Point relativeLocation = frameworkElement.TranslatePoint(new Point(0, 0), Parent);
            transform.X = (relativeLocation.X + ellipse.Width);
            transform.Y = relativeLocation.Y + ellipse.Height / 2;
            ellipse.RenderTransform = transform;
            //Reset points curveLine
            UpdatePointA();
            UpdatePointB();
        }
        private void UpdatePointA()
        {
            Point[] points = GetPositionFromTarget(ellipse, panel, pathLine.Figure.StartPoint, pathLine.PointCollection[0], offsetA[0], offsetA[1]);
            pathLine.Figure.StartPoint = points[0];
            pathLine.PointCollection[0] = points[1];
        }
        private void UpdatePointB()
        {
            Point[] points = GetPositionFromTarget(bControl, panel, pathLine.PointCollection[2], pathLine.PointCollection[1], offsetB[0], offsetB[1]);
            pathLine.PointCollection[2] = points[0];
            pathLine.PointCollection[1] = points[1];
        }
    }
}
