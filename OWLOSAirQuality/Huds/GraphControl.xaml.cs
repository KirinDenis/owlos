/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
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
    /// Interaction logic for GraphControl.xaml
    /// </summary>
    public partial class GraphControl : UserControl
    {
        public float?[]  data = { 1, 2, 3, 4, 5.4f, 1, 2, 1, 2.4f, 3, 0.4f, 5, 1, 2, 2, 1, 2, 3, 4, 5, 1, 2, 2, 1, 2, 3, 4, 5, 1, 2, 2, 1, 2, 3, 4, 5, 1, 2 };
        private float graphPlotHight = 100;
        private float graphTopY = 100;
        private float graphStartX = 0;
        public GraphControl()
        {
            InitializeComponent();
            Draw();
        }

        public void Draw()
        {
            float maxLocalValue = float.NaN;
            float minLocalValue = float.NaN;

            for (var mLocal = 0; mLocal < data.Length; mLocal++)
            {
                if (data[mLocal] == null)
                {
                    continue;
                }

                if (float.IsNaN(maxLocalValue) || data[mLocal] > maxLocalValue)
                {
                    maxLocalValue = (float) data[mLocal];
                }

                if (float.IsNaN(minLocalValue) || data[mLocal] < minLocalValue)
                {
                    minLocalValue = (float)data[mLocal];
                }
            }

            if (float.IsNaN(maxLocalValue))
            {
                maxLocalValue = 0.0f;
            }

            if (float.IsNaN(minLocalValue))
            {
                minLocalValue = 0.0f;
            }

            int stepLocal = 10;
            int halfStepLocal = stepLocal / 3; //If min == max then we decrease small value and increase big value by 10%

            if (maxLocalValue == minLocalValue)
            {
                maxLocalValue += (float)(maxLocalValue * 0.1);
                minLocalValue -= (float)(minLocalValue * 0.1);
            }
            else
            {
                var middleLocalValue = (maxLocalValue - minLocalValue) / 2;
                maxLocalValue += middleLocalValue;
                minLocalValue -= middleLocalValue;
            }

            var proportionLocal = graphPlotHight / (maxLocalValue - minLocalValue); //normalize Y

            for (var lLocal = 0; lLocal < data.Length; lLocal++)
            {
                data[lLocal] = graphTopY + (graphPlotHight - (data[lLocal] - minLocalValue) * proportionLocal);
            }

            var topOffsetLocal = graphPlotHight + graphTopY;
            string dLocal = "M " + graphStartX + ", " + topOffsetLocal;

            for (var nLocal = 0; nLocal < data.Length; nLocal++)
            {
                if (nLocal == 0)
                {
                    dLocal += " C " + graphStartX + ", " + data[nLocal]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " " + graphStartX + ", " + topOffsetLocal + " " + graphStartX + ", " + data[nLocal]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " ";
                }
                else
                {
                    var s1 = graphStartX + nLocal * stepLocal - halfStepLocal * 2;
                    var s2 = graphStartX + nLocal * stepLocal - halfStepLocal;
                    var s3 = graphStartX + nLocal * stepLocal;
                    dLocal += " C " + s1 + ", " + data[nLocal - 1]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " " + s2 + ", " + data[nLocal]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " " + s3 + ", " + data[nLocal]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " ";
                }
            }

            dLocal += " C " + graphStartX + stepLocal * (data.Length - 1) + "," + topOffsetLocal + " " + graphStartX + stepLocal * (data.Length - 1) + "," + topOffsetLocal + " " + graphStartX + stepLocal * (data.Length - 1) + "," + topOffsetLocal + " ";

            try
            {
                GraphPath.Data = Geometry.Parse(dLocal);
            }
            catch (Exception e)
            {
                //string s = e.Message;
            }

        }
    }
}
