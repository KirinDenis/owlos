/* ----------------------------------------------------------------------------
Ready IoT Solution - OWLOS
Copyright 2019, 2020, 2021 by:
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

using OWLOSThingsManager.Ecosystem.OWLOS;
using System.Windows;
using System.Windows.Controls;

namespace OWLOSThingsManager.EcosystemBrowser.BrowserControls
{
    public partial class QueryIntervalControl : UserControl
    {
        private readonly APIQueryInterval QueryInterval;
        public QueryIntervalControl(APIQueryInterval QueryInterval)
        {
            InitializeComponent();

            this.QueryInterval = QueryInterval;

            switch (QueryInterval.APIType)
            {
                case APINameType.GetAllDriverProperties:
                    NameCheckBox.Content = "get all drivers properties";
                    break;
                case APINameType.GetAllFiles:
                    NameCheckBox.Content = "get all files";
                    break;
                case APINameType.GetAllScripts:
                    NameCheckBox.Content = "get all scripts";
                    break;
            }

            NameCheckBox.IsChecked = QueryInterval.Enable;
            IntervalTextBox.Text = QueryInterval.Interval.ToString();
        }

        private void NameCheckBox_Checked(object sender, RoutedEventArgs e)
        {
            QueryInterval.Enable = true;
        }

        private void NameCheckBox_Unchecked(object sender, RoutedEventArgs e)
        {
            QueryInterval.Enable = false;
        }

        private void IntervalTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (QueryInterval != null)
            {
                uint value = QueryInterval.Interval;

                if (uint.TryParse(IntervalTextBox.Text, out value))
                {
                    QueryInterval.Interval = value;
                }
                else
                {
                    IntervalTextBox.Text = QueryInterval.Interval.ToString();
                }
            }

        }
    }
}
