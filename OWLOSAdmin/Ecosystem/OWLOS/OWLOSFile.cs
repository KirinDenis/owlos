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

using System;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{

    public class OWLOSFile
    {

        public object tag;
      
        public string name = string.Empty;

        protected int _size = -1;

        public delegate void ChangeFileSizeEventHandler(object sender, int size);
        public event ChangeFileSizeEventHandler OnFileSizeChange;
        
        public event EventHandler OnFileDelete;

        public bool exist = true;
        
        public int size
        {
            get => _size;
            set
            {
                _size = value;
                OnFileSizeChange?.Invoke(this, value);
            }

        }

        public event EventHandler OnTransportStatusChange;

        protected NetworkStatus _networkStatus = NetworkStatus.Offline;

        public NetworkStatus networkStatus
        {
            get => _networkStatus;
            set
            {
                _networkStatus = value;
                TransportStatusChange(new EventArgs());
            }
        }

        public void FileDeleteOutSide()
        {
            OnFileDelete?.Invoke(this, new EventArgs());
        }

        public void FileDeleteInsideSide()
        {
            OnFileDelete?.Invoke(this, new EventArgs());
        }


        protected virtual void TransportStatusChange(EventArgs e)
        {
            OnTransportStatusChange?.Invoke(this, e);
        }

        public bool FileDownload()
        {
            return true;
        }

    }
}
