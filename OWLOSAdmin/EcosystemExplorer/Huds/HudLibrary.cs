using System;
using System.Globalization;
using System.Windows;
using System.Windows.Media;

namespace OWLOSAdmin.EcosystemExplorer.Huds
{
    public static class HudLibrary
    {
        public static Point PolarToCartesian(double centerX, double centerY, double radius, double angleInDegrees)
        {
            double angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

            Point point = new Point(centerX + (radius * Math.Cos(angleInRadians)), centerY + (radius * Math.Sin(angleInRadians)));

            return point;
        }

        public static Geometry DrawArc(double x, double y, double radius, double startAngle, double endAngle)
        {

            Point start = PolarToCartesian(x, y, radius, endAngle);
            Point end = PolarToCartesian(x, y, radius, startAngle);

            int largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

            NumberFormatInfo nfi = new NumberFormatInfo
            {
                NumberDecimalSeparator = "."
            };

            try
            {
                return Geometry.Parse(string.Join(" ", new string[11] { "M", start.X.ToString(nfi), start.Y.ToString(nfi), "A", radius.ToString(nfi), radius.ToString(nfi), "0", largeArcFlag.ToString(nfi), "0", end.X.ToString(nfi), end.Y.ToString(nfi) }));
            }
            catch
            {
                return null;
            }
        }

    }
}
