using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemExplorer
{

    public struct EcosystemPathLine
    {
        public PathFigure Figure { get; set; }
        public PointCollection PointCollection { get; set; }

        public EcosystemPathLine(PathFigure figure)
        {
            Figure = figure;
            PointCollection = ((PolyBezierSegment)figure.Segments[0]).Points;
        }
    }

    public class EcosystemRelationLine
    {
        private EcosystemPathLine ecosystemPathLine;
        private EcosystemControl aControl;
        private EcosystemControl bControl;
        private FrameworkElement frameworkElement;
        private Panel panel;
        private Ellipse ellipse;
        private Path curveLine;
        private FrameworkElement Parent;
        private bool IsDisposed = false;
        private Point[] offsetA = new Point[2];
        private Point[] offsetB = new Point[2];
        public double ellipseWidth = 15;
        public double ellipseHeight = 15;
        private readonly TranslateTransform transform = new TranslateTransform();
        //private DependencyPropertyDescriptor dp = DependencyPropertyDescriptor.FromProperty(
        //Ellipse.RenderTransformProperty,
        //typeof(Ellipse));

        public EcosystemRelationLine(FrameworkElement parent, EcosystemControl aWorldObjectControl, EcosystemControl bWorldObjectControl,
            FrameworkElement frameworkElement, Panel panel,
            Point[] offsetA = null, Point[] offsetB = null)
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
                this.offsetA[0] = new Point(ellipseWidth, ellipseHeight / 2);
                this.offsetA[1] = new Point(100, 0);
            }

            if (offsetB != null && offsetB.Length == 2)
            {
                this.offsetB = offsetB;
            }
            else
            {
                this.offsetB[0] = new Point(0, 25);
                this.offsetB[1] = new Point(-100, 25);
            }


        }

        public Path DrawCurveLine(FrameworkElement startElement, FrameworkElement relativeElement, FrameworkElement target, string lineColor = "#ffff")
        {
            //Create curve line
            Point startPointA = startElement.TranslatePoint(new Point(0, 0), relativeElement);
            //Correct start point A
            startPointA = new Point(startPointA.X + startElement.Width, startPointA.Y + startElement.Height / 2);
            //Set leveling for point B
            Point startPointB = new Point(startPointA.X + 100, startPointA.Y);
            //Do same for end point A & B
            Point endPointA = new Point(target.Margin.Left + target.ActualWidth + 50, target.Margin.Top + 125);
            Point endPointB = new Point(endPointA.X - 100, endPointA.Y);
            return CreateCurveLine(new[] { startPointA, startPointB, endPointB, endPointA }, lineColor);
        }

        private Path CreateCurveLine(Point[] points, string lineColor = "#ffff")
        {
            // Create a Path to hold the geometry.
            Path path = new Path();
            path.CacheMode = null;
            path.Stroke = new BrushConverter().ConvertFromString(lineColor) as SolidColorBrush; ;
            path.StrokeThickness = 2;

            // Add a PathGeometry.
            PathGeometry path_geometry = new PathGeometry();
            path.Data = path_geometry;

            // Create a PathFigure.
            PathFigure path_figure = new PathFigure();
            path_geometry.Figures.Add(path_figure);

            // Start at the first point.
            path_figure.StartPoint = points[0];

            // Create a PathSegmentCollection.
            PathSegmentCollection path_segment_collection =
                new PathSegmentCollection();
            path_figure.Segments = path_segment_collection;

            // Add the rest of the points to a PointCollection.
            PointCollection point_collection =
                new PointCollection(points.Length - 1);
            for (int i = 1; i < points.Length; i++)
                point_collection.Add(points[i]);

            // Make a PolyBezierSegment from the points.
            PolyBezierSegment bezier_segment = new PolyBezierSegment();
            bezier_segment.Points = point_collection;

            // Add the PolyBezierSegment to othe segment collection.
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
            //new Point(points[0].X + ellipse.Width, points[0].Y + ellipse.Height / 2);
            Point correctPointB = new Point(points[1].X + offsetB.X, points[1].Y + offsetB.Y);
            //new Point(points[1].X + 100, points[1].Y);
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

        public Ellipse DrawPointer(FrameworkElement target, FrameworkElement relativeTarget, double width, double height, string color = "#ffff")
        {

            Point relativeLocation = target.TranslatePoint(new Point(0, 0), relativeTarget);
            Ellipse ellipse = new Ellipse();
            ellipse.VerticalAlignment = VerticalAlignment.Top;
            ellipse.Fill = new BrushConverter().ConvertFromString(color) as SolidColorBrush;
            Grid.SetRow(ellipse, 1);
            ellipse.Width = width;
            ellipse.Height = height;
            Matrix matrix = new Matrix();
            matrix.Translate((relativeLocation.X + target.ActualWidth + ellipse.Width) / 2, relativeLocation.Y + ellipse.Height / 2);
            ellipse.RenderTransform = new MatrixTransform(matrix);
            //ellipse.Margin = new Thickness(0, (relativeLocation.X + target.ActualWidth + ellipse.Width) / 2, -(relativeLocation.Y + ellipse.Height / 2), 0);
            return ellipse;
        }



        public bool DrawRelationLine(string ellipseColor = "#ffff", string lineColor = "#ffff")
        {
            if (IsDisposed) throw new ObjectDisposedException("Can't get access to disposed object.");
            if (ellipse != null) return false;
            if (curveLine != null) return false;

            ellipse = DrawPointer(frameworkElement, Parent, ellipseWidth, ellipseHeight, ellipseColor);
            aControl.mainGrid.Children.Add(ellipse);
            ellipse.UpdateLayout();

            curveLine = DrawCurveLine(ellipse, Parent, aControl);
            ellipse.Tag = curveLine;
            panel.Children.Insert(panel.Children.Count - 1, curveLine);
            curveLine.UpdateLayout();

            ecosystemPathLine = new EcosystemPathLine(((PathGeometry)curveLine.Data).Figures[0]);

            UpdatePositions();

            aControl.OnPositionChanged += Control_OnEventTriggered;
            bControl.OnPositionChanged += Control_OnEventTriggered;
            aControl.SizeChanged += Control_OnEventTriggered;
            bControl.SizeChanged += Control_OnEventTriggered;

            return true;
        }

        public void RemoveRelationLine()
        {
            if (IsDisposed) throw new ObjectDisposedException("Can't get access to disposed object.");

            aControl.mainGrid.Children.Remove(ellipse);
            panel.Children.Remove(curveLine);
        }

        public void Dispose()
        {
            if (IsDisposed) throw new ObjectDisposedException("Can't get access to disposed object.");

            IsDisposed = true;
            RemoveRelationLine();
            ecosystemPathLine = default(EcosystemPathLine);
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

        private void UpdatePositions()
        {
            Point relativeLocation = frameworkElement.TranslatePoint(new Point(0, 0), Parent);
            transform.X = (relativeLocation.X + frameworkElement.ActualWidth + ellipse.Width) / 2;
            transform.Y = relativeLocation.Y + ellipse.Height / 2;
            ellipse.RenderTransform = transform;

            //Reset points curveLine
            UpdatePointA();
            UpdatePointB();
        }


        private void UpdatePointA()
        {

            Point[] points = GetPositionFromTarget( ellipse, panel, ecosystemPathLine.Figure.StartPoint,
                ecosystemPathLine.PointCollection[0], offsetA[0], offsetA[1]);
            ecosystemPathLine.Figure.StartPoint = points[0];
            ecosystemPathLine.PointCollection[0] = points[1];
        }


        private void UpdatePointB()
        {
            Point[] points = GetPositionFromTarget(bControl, panel, ecosystemPathLine.PointCollection[2],
                ecosystemPathLine.PointCollection[1], offsetB[0], offsetB[1]);
            ecosystemPathLine.PointCollection[2] = points[0];
            ecosystemPathLine.PointCollection[1] = points[1];
        }

    }
}
