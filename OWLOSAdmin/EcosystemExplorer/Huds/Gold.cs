using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSAdmin.EcosystemExplorer.Huds
{
    public static class Gold
    {
        public const double goldenRation = 1.61803398875;
        public const double baseSize = 1280.0f;
        public const double cellSize = baseSize * goldenRation * goldenRation * goldenRation * goldenRation * goldenRation;
        public const double stepSize = cellSize / goldenRation / goldenRation / goldenRation / goldenRation / goldenRation / goldenRation / goldenRation / goldenRation / goldenRation;

        public static readonly double size = 700;
        public static readonly double center = size / 2;
        public static readonly double radius = size / 2.618;
        public static readonly double radius1 = radius / goldenRation;
        public static readonly double radius2 = radius1 / goldenRation;
        public static readonly double radius3 = radius2 / goldenRation;
        public static readonly double radius4 = radius3 / goldenRation;
        public static readonly double radius5 = radius4 / goldenRation;
        public static readonly double radius6 = radius5 / goldenRation;
        public static readonly double radius7 = radius6 / goldenRation;
        public static readonly double radius8 = radius7 / goldenRation;
    }
}
