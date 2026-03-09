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
using System.Windows.Input;
using System.Windows.Media;

namespace OWLOSThingsManager.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for TabControl.xaml
    /// </summary>
    public partial class TabControl : UserControl
    {
        private bool _Active = false;
        public bool Active
        {
            get => _Active;

            set
            {
                if (value)
                {
                    Background = new SolidColorBrush(Color.FromArgb(0xFF, 0xFF, 0xE0, 0xAC));
                    NameTextBlock.Foreground = SystemColors.InfoTextBrush;
                    CloseButton.Foreground = SystemColors.InfoTextBrush;
                }
                else
                {
                    Background = new SolidColorBrush(Color.FromArgb(0xFF, 0x3B, 0x4F, 0x81));
                    NameTextBlock.Foreground = SystemColors.HighlightTextBrush;
                    CloseButton.Foreground = new SolidColorBrush(Color.FromArgb(0xFF, 0xFF, 0xE0, 0xAC));
                }
                _Active = value;
            }
        }

        public event EventHandler OnSelect;
        public event EventHandler OnClose;
        public TabControl()
        {
            InitializeComponent();
        }

        private void NameTextBlock_MouseDown(object sender, MouseButtonEventArgs e)
        {
            OnSelect?.Invoke(this, new EventArgs());
        }

        private void UserControl_MouseEnter(object sender, MouseEventArgs e)
        {
            Background = SystemColors.InactiveCaptionBrush;
            NameTextBlock.Foreground = SystemColors.InfoTextBrush;
            CloseButton.Foreground = SystemColors.InfoTextBrush;
        }

        private void UserControl_MouseLeave(object sender, MouseEventArgs e)
        {
            Active = _Active;
        }

        private void CloseButton_PreviewMouseDown(object sender, MouseButtonEventArgs e)
        {
            OnClose?.Invoke(this, new EventArgs());
            e.Handled = true;
        }
    }
}
