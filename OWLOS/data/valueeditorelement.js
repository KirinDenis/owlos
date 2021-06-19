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

function createValueEdit(parentElement, propertyName, propertyValue, propertyType) {
    var edit = "";

    if (propertyType.indexOf("r") == -1) {
        if (propertyType.indexOf("b") != -1) //boolean
        {
            edit = parentElement.appendChild(document.createElement('select'));
            edit.className = "form-control form-control-sm";
            edit.style.width = "100%";
            var valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "true";
            valueSelectOption = edit.appendChild(document.createElement('option'));
            valueSelectOption.innerText = "false";
            if ((propertyValue === "1") || (propertyValue === 'true')) edit.selectedIndex = 0; else edit.selectedIndex = 1;
        }
        else
            if (propertyType.indexOf("c") != -1) {
                edit = parentElement.appendChild(document.createElement('select'));
                edit.className = "form-control form-control-sm";
                edit.style.width = "100%";
                edit.style.backgroundColor = propertyValue;
                edit.onchange = colorSelectOnChange;
                var valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = propertyValue;
                valueSelectOption.style.backgroundColor = propertyValue;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.primary;
                valueSelectOption.style.backgroundColor = theme.primary;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.secondary;
                valueSelectOption.style.backgroundColor = theme.secondary;


                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.success;
                valueSelectOption.style.backgroundColor = theme.success;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.info;
                valueSelectOption.style.backgroundColor = theme.info;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.warning;
                valueSelectOption.style.backgroundColor = theme.warning;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.danger;
                valueSelectOption.style.backgroundColor = theme.danger;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.light;
                valueSelectOption.style.backgroundColor = theme.light;

                valueSelectOption = edit.appendChild(document.createElement('option'));
                valueSelectOption.innerText = theme.dark;
                valueSelectOption.style.backgroundColor = theme.dark;

                edit.selectedIndex = 0;
            }
            else {
                edit = parentElement.appendChild(document.createElement('input'));
                edit.className = "form-control form-control-sm";

                if (propertyType.indexOf("p") != -1) //password
                {
                    edit.type = "password";
                    edit.placeholder = "Password";
                }

                if (propertyType.indexOf("i") != -1) //integer
                {
                    edit.type = "number";
                }

                if (propertyType.indexOf("f") != -1) //float
                {
                    edit.type = "number";
                    edit.step = "0.01";
                }

                edit.style.width = "100%";
                edit.value = propertyValue;
            }

        if (propertyType.indexOf("s") != -1) //selected
        {
            edit.style.backgroundColor = "#FAFAF0";
        }

        edit.id = "propValueInput_" + propertyName;
        edit.propname = propertyName;
        edit.propvalue = propertyValue; //default

        edit.proptype = propertyType;
    }

    return edit;
}

function colorSelectOnChange(event) {
    var select = event.currentTarget;
    select.style.backgroundColor = select.options[select.selectedIndex].style.backgroundColor;
    return false;
}


