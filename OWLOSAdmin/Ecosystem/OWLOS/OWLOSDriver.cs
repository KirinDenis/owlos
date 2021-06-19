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

using System.Collections.Generic;
using System.Threading.Tasks;
using static OWLOSThingsManager.Ecosystem.OWLOS.OWLOSDriverProperty;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{


    public class OWLOSDriver
    {
        public OWLOSThing parentThing = null;

        public string name = "";

        public List<OWLOSDriverProperty> properties = new List<OWLOSDriverProperty>();

        public event PropertyEventHandler OnPropertyCreate;

        public OWLOSDriver(OWLOSThing parentThing, string name)
        {
            this.parentThing = parentThing;
            this.name = name;
            
        }
        public async Task<bool> SetParsedProperty(string name, string value)
        {
            string _value = value.Substring(0, value.IndexOf("//"));
            string _flags = value.Substring(value.IndexOf("//") + 2);

            OWLOSDriverProperty property =  properties.Find(p => p.name == name);

            if (property == null)
            {
                property = new OWLOSDriverProperty(this, name, _value, _flags);
                properties.Add(property);
                PropertyCreate(new OWLOSPropertyWrapperEventArgs(property));
            }
            else
            {
                property.SetOutside(_value);
            }

            return true;
        }
        protected virtual void PropertyCreate(OWLOSPropertyWrapperEventArgs e)
        {
            OnPropertyCreate?.Invoke(this, e);
        }
        public int GetPropertiesCount()
        {
            return properties.Count;
        }
        public OWLOSDriverProperty GetProperty(string name)
        {
            return properties.Find(p => p.name == name);
        }
        public bool SetPropertyValue(string name, string value)
        {
            OWLOSDriverProperty property = GetProperty(name);
            if (property == null)
            {
                return false;
            }
            property.value = value;
            return true;
        }

    }

}
