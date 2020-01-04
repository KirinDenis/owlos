var parsedFilesList = "";

function requestFilesList() {
    var httpResult = httpGet(boardhost + "getfilelist?path=");
    if (httpResult != "%error") {
        parsedFilesList = httpResult.split("\n");
    }
    else {
        parsedFilesList = "";
    }
}

function renderFilesList() {

    requestFilesList();
    if (parsedFilesList !== "") {

        var filesAnchors = document.getElementById("filesAnchors");
        filesAnchors.innerHTML = "";

        var uploadSpan = filesAnchors.appendChild(document.createElement('button'));
        uploadSpan.className = "btn btn-success";
        uploadSpan.type = "button";
        uploadSpan.href = boardhost + "upload";
        uploadSpan.onclick = uploadClick;
        uploadSpan.setAttribute("data-toggle", "modal");
        uploadSpan.setAttribute("data-target", "#uploadModal");
        uploadSpan.innerText = getLang("upload");


        var filesPanel = document.getElementById("filesPanel");
        filesPanel.innerHTML = "";

        var div = filesPanel.appendChild(document.createElement('div'));
        div.className = "col-md-12 devicediv";
        div.id = "filesDiv";
        var deviceDiv = div.appendChild(document.createElement('div'));
        deviceDiv.className = "col-md-12 border-0 devicecard";
        var deviceDivHeader = deviceDiv.appendChild(document.createElement('div'));
        deviceDivHeader.className = "card-header";
        deviceDivHeader.innerText = getLang("files");
        var tableDiv = deviceDiv.appendChild(document.createElement('div'));
        tableDiv.className = "card-body";

        table = tableDiv.appendChild(document.createElement('table'));
        table.className = "table table-striped table-sm";
        table.id = "filestable";
        table.cellspacing = "0";


        var thead = table.appendChild(document.createElement('thead'));
        var tr = thead.appendChild(document.createElement('tr'));

        var th = tr.appendChild(document.createElement('th'))
        th.className = "w-2";
        th.innerText = "#";
        th.scope = "col";


        th = tr.appendChild(document.createElement('th'))
        th.className = "w-10";
        th.innerText = "name";
        th.scope = "col";


        th = tr.appendChild(document.createElement('th'))
        th.className = "w-5";
        th.innerText = "size";
        th.scope = "col";


        th = tr.appendChild(document.createElement('th'))
        //th.className = "w-50";
        th.innerText = "";
        th.scope = "col";

        var tbody = table.appendChild(document.createElement('tbody'));
        var filesCount = 1;
        for (var i = 0; i < parsedFilesList.length; i++) {
            if (parsedFilesList[i] === "") continue;
            var parsedFile = parsedFilesList[i].split(" ");

            var tr = tbody.appendChild(document.createElement('tr'));
            var th = tr.appendChild(document.createElement('th'));
            th.scope = "row";
            th.innerHTML = filesCount;
            filesCount++;

            var nameTd = tr.appendChild(document.createElement('td'));
            var downloadHref = nameTd.appendChild(document.createElement('a'));

            downloadHref.href = boardhost + "downloadfile?name=" + parsedFile[0];
            downloadHref.target = "_blank";
            downloadHref.title = "Download '" + parsedFile[0] + "' file";
            downloadHref.innerText = parsedFile[0];

            var valueTd = tr.appendChild(document.createElement('td'));
            var valueSpan = valueTd.appendChild(document.createElement('span'));
            valueSpan.className = "align-middle";
            valueSpan.innerText = parsedFile[1];

            var deleteTd = tr.appendChild(document.createElement('td'));

            var deleteSpan = deleteTd.appendChild(document.createElement('a'));
            deleteSpan.className = "badge badge-danger";
            deleteSpan.href = "#";
            deleteSpan.style.margin = "4px 0px 0px 0px";
            deleteSpan.id = "_" + parsedFile[0];
            deleteSpan.filename = parsedFile[0];
            deleteSpan.onclick = deleteClick;
            deleteSpan.innerText = "del";

        }
        //$("#filestable").DataTable({ "pageLength": 100 });

        $("#filestable").DataTable({
            "pageLength": 100,
            "language": {
                "lengthMenu": getLang("dt_display") + " _MENU_ " + getLang("dt_recordsperpage"),
                "info": getLang("dt_showing") + " _START_ " + getLang("dt_to") + " _END_ " + getLang("dt_of") + " _TOTAL_ " + getLang("dt_entries"),
                "search": getLang("dt_search"),
                "paginate": {
                    "first": getLang("dt_first"),
                    "last": getLang("dt_last"),
                    "next": getLang("dt_next"),
                    "previous": getLang("dt_previous")
                }
            }
        });

        //OK parse data
        // $('.dataTables_length').addClass('bs-select');

    }
    else {
        parsedfiles = "";
    }
}

function deleteClick(event) {
    event.stopPropagation();
    var deleteButton = event.target;
    deleteButton.className = "badge badge-warning";
    deleteButton.value = 'do...';
    deleteButton.disable = true;

    var httpResult = deleteFile(deleteButton.filename);

    if (httpResult == 1) {
        renderFilesList();
    }
    else {
        deleteButton.className = "badge badge-danger";
        deleteButton.value = 'bad';
    }
    deleteButton.disable = false;
    return false;
}

function uploadClick() {

    document.getElementById("addDevicePanel").innerHTML = "";
    document.getElementById("resetPanel").innerHTML = "";

    var uploadPanel = document.getElementById("uploadPanel");
    uploadPanel.innerHTML = "";
    var modalFade = uploadPanel.appendChild(document.createElement("div"));

    modalFade.className = "modal fade";
    modalFade.id = "uploadModal";
    modalFade.tabindex = "-1";
    modalFade.setAttribute("role", "dialog");
    modalFade.setAttribute("aria-labelledby", "uploadModalLabel");
    modalFade.setAttribute("aria-hidden", "true");

    var modalDialog = modalFade.appendChild(document.createElement("div"));
    modalDialog.className = "modal-dialog";
    modalDialog.role = "document";

    var modalContent = modalDialog.appendChild(document.createElement("div"));
    modalContent.className = "modal-content";

    var modalHeader = modalContent.appendChild(document.createElement("div"));
    modalHeader.className = "modal-header";

    var modalTitle = modalHeader.appendChild(document.createElement("h5"));

    modalTitle.className = "modal-title";
    modalTitle.id = "uploadModalLabel";
    modalTitle.innerText = getLang("uploadfiles");

    var closeHeaderButton = modalHeader.appendChild(document.createElement("button"));

    closeHeaderButton.type = "button"
    closeHeaderButton.className = "close"
    closeHeaderButton.setAttribute("data-dismiss", "modal");
    closeHeaderButton.setAttribute("aria-label", "Close");

    var closeSpan = closeHeaderButton.appendChild(document.createElement("span"));
    closeSpan.setAttribute("aria-hidden", "true");
    closeSpan.innerText = "x"

    var modalBody = modalContent.appendChild(document.createElement("div"));
    modalBody.className = "modal-body";

    var inputGroup = modalBody.appendChild(document.createElement("form"));
    inputGroup.className = "form-group";
    inputGroup.id = "inputGroup";
    inputGroup.addEventListener('submit', inputGroupSubmit);

    var inputgroupprepend = inputGroup.appendChild(document.createElement("div"));
    inputgroupprepend.className = "input-group-prepend";

    var customFile = inputGroup.appendChild(document.createElement("div"));
    customFile.className = "custom-file  form-control-sm";

    label = customFile.appendChild(document.createElement("label"));
    label.className = "custom-file-label";
    label.setAttribute("for", "inputGroupFile01");
    label.innerText = getLang("selectfiles");

    var fileInput = customFile.appendChild(document.createElement("input"));
    fileInput.className = "custom-file-input";
    fileInput.id = "inputGroupFile01";
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("aria-describedby", "inputGroupFileAddon01");
    fileInput.multiple = true;

    fileInput.onchange = inputGroupChange;

    var filesList = customFile.appendChild(document.createElement("div"));
    filesList.id = "filesList";

    fileInput.filesList = filesList;
    fileInput.label = label;
    fileInput.customFile = customFile;

    var modalFooter = modalContent.appendChild(document.createElement("div"));
    modalFooter.className = "modal-footer";

    var closeButton = modalFooter.appendChild(document.createElement("button"));
    closeButton.type = "button";
    closeButton.className = "btn btn-info";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.innerText = getLang("cancel");

    $("#uploadtModal").modal('show');

    return false;
}

const units = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']; // %)

function formatBytes(x) {
    let l = 0, n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
        n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

function inputGroupChange() {
    var fileInput = event.target;
    var filesList = fileInput.filesList;
    var label = fileInput.label;
    filesList.innerHTML = "";

    var files = fileInput.files;
    var totalSize = 0;
    for (var i = 0; i < files.length; i++) {
        var fileItem = filesList.appendChild(document.createElement("div"));
        fileItem.id = files[i].name + "fileItem";
        fileItem.innerHTML += "<b>" + files[i].name + "</b> " + formatBytes(files[i].size + " ");
        totalSize += files[i].size;
    }
    filesList.appendChild(document.createElement("div")).innerHTML += "<br>";

    var uploadFileButton = filesList.appendChild(document.createElement("button"));
    uploadFileButton.className = "btn btn-success";
    uploadFileButton.id = "doUploadButton"
    uploadFileButton.setAttribute("type", "submit");
    uploadFileButton.innerText = "upload";
    uploadFileButton.used = false;

    label.innerText = files.length + " file(s) selected, size " + formatBytes(totalSize);

}

function uploadFileByIndex(index) {
   // var endPoint = "http://192.168.1.5:8084/uploadfile" //DEBUG
    var endPoint = boardhost + "uploadfile" //war mode
    var inputGroup = document.getElementById("inputGroup");
    var inputFile = document.getElementById("inputGroupFile01");
    var filesList = document.getElementById("filesList");
    var files = inputFile.files;
    if (index >= files.length) {
        var uploadFileButton = document.getElementById("doUploadButton");
        uploadFileButton.innerText = "complete"        
        return;
    }

    var fileItem = document.getElementById(files[index].name + "fileItem");
    if (fileItem == null) return;


        var formData = new FormData(inputGroup);
 

    formData.append(files[index].name, files[index], files[index].name);
        var request = new XMLHttpRequest();
        request.fileItem = fileItem;

        request.onloadend = function (oEvent) {

            if (this.readyState == 4) this.fileItem.innerHTML += " done";
            else
                if (this.status != 0) {
                    this.fileItem.innerHTML += this.status + " " + this.responseText;
                }
            uploadFileByIndex(++index);
        }

        request.onprogress = function (oEvent) {
            if (this.status == 0) return;
            this.fileItem.innerHTML += ".";
        }

        request.onloadstart = function (oEvent) {
            if (this.readyState == 1) {
                this.fileItem.innerHTML += ".";
            }
        }

        request.onabort = function (oEvent) {
            if (this.status == 0) return;
            this.fileItem.innerHTML += " abort";
        }

        request.onerror = function (oEvent) {
            if (this.status == 0) return;
            this.fileItem.innerHTML += " error";
        }

        request.ontimeout = function (oEvent) {
            if (this.status == 0) return;
            this.fileItem.innerHTML += " timeout";
        }

        request.onreadystatechange = function (oEvent) {
            this.fileItem.innerHTML += ".";
        }

        request.onload = function (oEvent) {
            
            
            if (request.status == 200) {
                this.fileItem.innerHTML += "OK";
            }
            else
                if (request.status == 503) {
                    
                        this.fileItem.innerHTML +="can't create file";
                }
                else
                    if (request.status == 503) {
                        this.fileItem.innerHTML += "aborted";
                    }
                    else {
                        this.fileItem.innerHTML += request.status + " error";
                    }

        };

        request.open("POST", endPoint, true);
        request.send(formData);
}

function inputGroupSubmit(event) {
    var uploadFileButton = document.getElementById("doUploadButton");
    if (!uploadFileButton.used) {
        uploadFileButton.used = true;
        uploadFileButton.className = "btn btn-default";
        uploadFileButton.setAttribute("type", "");
        uploadFileButton.innerText = "in progress...";
        uploadFileButton.disable = true;
        uploadFileByIndex(0);
    }
    event.preventDefault();
}


