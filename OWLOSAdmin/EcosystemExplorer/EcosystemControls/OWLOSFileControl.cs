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

using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Windows.Controls;
using System.Windows.Media;

namespace OWLOSThingsManager.EcosystemExplorer.EcosystemControls
{
    public class OWLOSFileControl: OWLOSPanelControl
    {
        private readonly OWLOSFiles files;

        public OWLOSFileControl(OWLOSFiles files) : base()
        {
            this.files = files;
            panelName.Text = "files";
            foreach(OWLOSFile file in files.filesList)
            {
                TextBlock textBlock = new TextBlock
                {
                    Foreground = Foreground = (SolidColorBrush)App.Current.Resources["OWLOSInfo"],
                    Text = file.name + " " + file.size.ToString(),
                    Tag = file
                };
                file.tag = textBlock;
                file.OnFileSizeChange += File_OnFileSizeChange;
                file.OnFileDelete += File_OnFileDelete;
                itemsHolder.Children.Add(textBlock);
            }

            files.OnNewFile += Files_OnNewFile;
        }

        private void File_OnFileDelete(object sender, EventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {

                OWLOSFile file = sender as OWLOSFile;
                TextBlock textBlock = file.tag as TextBlock;
                itemsHolder.Children.Remove(textBlock);
                textBlock = null;
            });

        }

        private void File_OnFileSizeChange(object sender, int size)
        {
            base.Dispatcher.Invoke(() =>
            {

                OWLOSFile file = sender as OWLOSFile;
                TextBlock textBlock = file.tag as TextBlock;
                textBlock.Text = file.name + " " + file.size.ToString();
            });
        }

        private void Files_OnNewFile(object sender, OWLOSFile owlosFile)
        {
            base.Dispatcher.Invoke(() =>
            {
                TextBlock textBlock = new TextBlock
                {
                    Foreground = Foreground = (SolidColorBrush)App.Current.Resources["OWLOSInfo"],
                    Text = owlosFile.name + " " + owlosFile.size.ToString(),
                    Tag = owlosFile
                };
                owlosFile.tag = textBlock;
                itemsHolder.Children.Add(textBlock);
            });

        }
    }
}
