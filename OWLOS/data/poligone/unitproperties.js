var parsedUnitProperties;

function requestUnitProperties() {
    var httpResult = httpGet(host + "getallunitproperties");
    if (httpResult != "%error") {
        parsedUnitProperties = httpResult.split("\n");
    }
    else {
        parsedUnitProperties = "";
    }

}

function requestUnitPropertiesAsync(asyncReciever) {
    httpGetAsyncWithReciever(host + "getallunitproperties", unitPropertiesAsyncReciever, asyncReciever);
}

function unitPropertiesAsyncReciever(httpResult, asyncReciever) {
    if (httpResult != "%error") {
        parsedUnitProperties = httpResult.split("\n");
    }
    else {
        parsedUnitProperties = "";
    }
    if (asyncReciever != null) {
        asyncReciever();
    }
}


function createTable(panel, name) {

    var div = panel.appendChild(document.createElement('div'));
    div.className = "col-md-12 devicediv";
    div.id = "div" + name;
    var deviceDiv = div.appendChild(document.createElement('div'));
    deviceDiv.className = "col-md-12 border-0 devicecard";
    deviceDiv.id = name;
    var deviceDivHeader = deviceDiv.appendChild(document.createElement('div'));
    deviceDivHeader.className = "card-header";
    deviceDivHeader.innerText = name;
    var tableDiv = deviceDiv.appendChild(document.createElement('div'));
    tableDiv.className = "card-body";


    var table = tableDiv.appendChild(document.createElement('table'));
    table.className = "table table-striped table-sm";
    table.id = "table" + name;
    table.cellspacing = "0";

    var thead = table.appendChild(document.createElement('thead'));

    var tr = thead.appendChild(document.createElement('tr'));

    var th = tr.appendChild(document.createElement('th'))
    th.className = "w-2";
    th.scope = "col";
    th.innerText = "#";

    th = tr.appendChild(document.createElement('th'))
    th.className = "w-10";
    th.scope = "col";
    th.innerText = "name";

    th = tr.appendChild(document.createElement('th'))
    th.className = "w-25";
    th.scope = "col";
    th.innerText = "value";

    th = tr.appendChild(document.createElement('th'))
    th.className = "w-25";
    th.scope = "col";
    th.innerText = "new value";

    th = tr.appendChild(document.createElement('th'))
    th.className = "w-5";
    th.scope = "col";
    th.innerText = "";

    th = tr.appendChild(document.createElement('th'))
    th.className = "w-5";
    th.scope = "col";
    th.innerText = "";

    var anchorTopHref = th.appendChild(document.createElement('a'));
    anchorTopHref.href = "#top";
    anchorTopHref.innerText = "top";


    var tbody = table.appendChild(document.createElement('tbody'));
    tbody.id = "tbody" + name;

    var anchorHref = document.getElementById("unitAnchors").appendChild(document.createElement('button'));
    anchorHref.type = "button";
    anchorHref.href = "#" + name;
    anchorHref.onclick = deviceClick;
    anchorHref.innerText = name;
    anchorHref.className = "btn btn-default";

}

function renderUnitProperties() {

    requestUnitProperties();

    if (parsedUnitProperties !== "") {

        document.getElementById("unitAnchors").innerHTML = "";
        var unitPanel = document.getElementById("unitPanel");
        unitPanel.innerHTML = "";
        createTable(unitPanel, "network");
        createTable(unitPanel, "esp");
        createTable(unitPanel, "unit");
        createTable(unitPanel, "wifi");
        var networkCount = 1;
        var espCount = 1;
        var unitCount = 1;
        var wifiCount = 1;

        for (var i = 0; i < parsedUnitProperties.length; i++) {
            if (parsedUnitProperties[i] === "") continue;
            var parsedProp = parsedUnitProperties[i].split("=");

            var propertyName = parsedProp[0];
            var propertyValue = ""
            var propertyType = "";

            if (parsedProp.length > 1) {
                var _value = parsedProp[1].split("//");
                propertyValue = _value[0];
                if (_value.length > 1) {
                    propertyType = _value[1];
                }
            }


            var tbody;
            var count;
            if (propertyName.includes("wifi")) {
                count = wifiCount++;
                tbody = document.getElementById("tbodywifi");
            }
            else
                if (propertyName.includes("mqtt") || propertyName.includes("restful") || propertyName.includes("ota")) {
                    count = networkCount++;
                    tbody = document.getElementById("tbodynetwork");
                }
                else
                    if (propertyName.includes("esp")) {
                        count = espCount++;
                        tbody = document.getElementById("tbodyesp");
                    }
                    else {
                        count = unitCount++;
                        tbody = document.getElementById("tbodyunit");
                    }

            var tr = tbody.appendChild(document.createElement('tr'));


            var th = tr.appendChild(document.createElement('th'));
            th.scope = "row";
            th.innerHTML = count;



            var nameTd = tr.appendChild(document.createElement('td'));
            var getPropHref = nameTd.appendChild(document.createElement('a'));
            if (propertyType.includes("s")) { //selected
                getPropHref.className = "text-warning"; //"btn btn-success"; 
            }

            getPropHref.href = host + "getunitproperty?property=" + propertyName;
            getPropHref.target = "_blank";
            getPropHref.title = "Get " + propertyName + " unit property value [RESTful API execute]";
            getPropHref.innerText = propertyName;

            var valueTd = tr.appendChild(document.createElement('td'));
            var setPropHref = valueTd.appendChild(document.createElement('a'));
            setPropHref.href = host + "setunitproperty?property=" + propertyName + "&value=" + propertyValue;
            setPropHref.target = "_blank";
            setPropHref.title = "Set " + propertyName + " unit property value [RESTful API execute][return '1' if success]";
            if (propertyType.includes("b")) {
                if (propertyValue === "1") setPropHref.innerText = "true";
                else
                    setPropHref.innerText = "false";
            }
            else {
                setPropHref.innerText = propertyValue;
            }


            var edit = createValueEdit(tr.appendChild(document.createElement('td')), propertyName, propertyValue, propertyType);
            /*
            var editTd = tr.appendChild(document.createElement('td'));
            if (autorefreshbutton.data === "off") {
                var edit = editTd.appendChild(document.createElement('input'));
                edit.type = "text";
                edit.className = "form-control form-control-sm";
                edit.id = "propValueInput_" + propertyName;
                edit.style.width = "100%";
                edit.propname = propertyName;
                edit.value = propertyValue;
            }
            */
            var setButtonTd = tr.appendChild(document.createElement('td'));
            var getButtonTd = tr.appendChild(document.createElement('td'));

            if (autorefreshbutton.data === "off") {
                var getSpan = getButtonTd.appendChild(document.createElement('a'));
                getSpan.className = "badge badge-info";
                getSpan.href = "#";
                getSpan.style.margin = "4px 0px 0px 0px";
                getSpan.id = "_" + propertyName;
                getSpan.edit = edit;
                getSpan.valueTd = setPropHref;
                getSpan.propname = propertyName;
                getSpan.onclick = getUnitClick;
                getSpan.innerText = "get";


                if (!propertyType.includes("r")) {
                    getSpan.edit = edit;
                    var span = setButtonTd.appendChild(document.createElement('a'));
                    span.className = "badge badge-warning";
                    span.href = "#";
                    span.style.margin = "4px 0px 0px 0px";
                    span.id = "_" + propertyName;
                    span.edit = edit;
                    span.valueTd = setPropHref;
                    span.onclick = setUnitClick;
                    span.innerText = "set";
                }
            }



        }

        $("#tableunit").DataTable();
        $("#tablewifi").DataTable();
        $("#tablenetwork").DataTable();
        $("#tableesp").DataTable();

        //  $('.dataTables_length').addClass('bs-select');

    }
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
function createValueEdit(parentElement, propertyName, propertyValue, propertyType) {

                var edit = "";
                if ((!propertyType.includes("r")) && (autorefreshbutton.data === "off")) {


		    if (propertyType.includes("b")) //boolean
                    {
    			edit = parentElement.appendChild(document.createElement('select'));
    			edit.className = "form-control form-control-sm";
    			edit.style.width = "100%";
    			var valueSelectOption = edit.appendChild(document.createElement('option'));
    			valueSelectOption.innerText = "true";
   		        valueSelectOption = edit.appendChild(document.createElement('option'));
    			valueSelectOption.innerText = "false";
                        if (propertyValue === "1") edit.selectedIndex = 0;
                        else   
                          edit.selectedIndex = 1;
                    }
                    else 
                    {
                    edit = parentElement.appendChild(document.createElement('input'));
                    edit.className = "form-control form-control-sm";
                    if (propertyType.includes("i")) //integer
 		    {
                    	edit.type = "number";
                    } 
                    if (propertyType.includes("f")) //float
 		    {
                    	edit.type = "number";
		    	edit.step="0.01";
                    } 

                    edit.style.width = "100%";
                    edit.value = propertyValue;
                    }   

                    if (propertyType.includes("s")) //selected
                    {
                      edit.style.backgroundColor = "#FAFAF0";
                    }

                    edit.id = "propValueInput_" + propertyName;
 
                    edit.propname = propertyName;
                    edit.propvalue = propertyValue;  //default
                    edit.proptype = propertyType;  

                }
         return edit; 
}
*/

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getParsedUnitProperty(property) {
    if (parsedUnitProperties !== "") {
        for (var i = 0; i < parsedUnitProperties.length; i++) {
            if (parsedUnitProperties[i] === "") continue;
            if (parsedUnitProperties[i].includes(property + "=")) {
                return parsedUnitProperties[i].split("=")[1].split("//")[0];
            }
        }
    }
    return "";
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*function setUnitClick(event) {

    event.stopPropagation();
    var button = event.target;

    var edit = button.edit;

    button.className = "badge badge-warning";
    button.value = 'do...';
    button.disable = true;

    var httpResult = setUnitProperty(edit.propname, edit.value);

    if (httpResult == 1) {
        button.className = "badge badge-success";
        button.value = 'set';
        button.valueTd.innerText = edit.value;
    }
    else {
        button.className = "badge badge-danger";
        button.value = 'bad';
    }
    button.disable = false;


    return false;
}



function getUnitClick(event) {

    event.stopPropagation();
    var button = event.target;

    var edit = button.edit;

    button.className = "badge badge-warning";
    button.value = 'do...';
    button.disable = true;

    var httpResult = getUnitProperty(button.propname);

    if (httpResult !== "%error") {
        button.className = "badge badge-success";
        button.value = 'get';
        button.valueTd.innerText = httpResult;
        if (edit != null) {
            edit.value = httpResult;
        }
    }
    else {
        button.className = "badge badge-danger";
        button.value = 'bad';
    }
    button.disable = false;

    return false;
}
*/

function setUnitClick(event) {


    event.stopPropagation();
    var button = event.target;

    var edit = button.edit;
    var value = edit.value;
    if (edit.proptype.includes("b")) // boolean 
    {
        if (edit.selectedIndex == 0) value = "1";
        else value = "0";
    }

    button.className = "badge badge-warning";
    button.innerText = 'do...';
    button.disable = true;

    var httpResult = setUnitProperty(edit.propname, value);


    if (httpResult == 1) {
        button.className = "badge badge-success";
        button.innerText = 'set';
        button.valueTd.innerText = edit.value;
    }
    else {
        button.className = "badge badge-danger";
        button.innerText = "bad:\n" + httpResult;
    }
    button.disable = false;
    //httpResult = 1 if OK
    return false;
}

function getUnitClick(event) {

    event.stopPropagation();
    var button = event.target;

    var edit = button.edit;

    button.className = "badge badge-warning";
    button.innerText = 'do...';
    button.disable = true;

    var httpResult = getUnitProperty(button.propname);

    if (!httpResult.includes("error")) {
        button.className = "badge badge-success";
        button.innerText = 'get';
        if (edit != null) {
            if (edit.proptype.includes("b")) // boolean 
            {
                if (httpResult === "1") edit.selectedIndex = 0;
                else edit.selectedIndex = 1;
            }
            else {
                edit.value = httpResult;
            }
            button.valueTd.innerText = edit.value;
        }
        else {
            button.valueTd.innerText = httpResult;
        }
    }
    else {
        button.className = "badge badge-danger";
        button.innerText = "bad:\n" + httpResult;
    }
    button.disable = false;
    //httpResult = 1 if OK
    return false;
}



