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

const things = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];

var FilesList =

    function () {
        "use strict";

        function FilesList(filesAnchors, thing) {
            this.filesAnchors = filesAnchors;
            this.thing = thing;
            this.parsedFilesList = "";
            this.filesAnchors.innerHTML = "";
            this.requestFilesList();
        }

        var _proto = FilesList.prototype;

        _proto.requestFilesList = function requestFilesList() {
            this.parsedFilesList = "";
            httpGetAsyncWithReciever(this.thing.host + "getfilelist?path=", this.requestFilesListResult, this);
        };

        _proto.requestFilesListResult = function requestFilesListResult(HTTPResult, sender) {
            if (HTTPResult != "%error") {
                sender.parsedFilesList = HTTPResult.split("\n");
            } else {
                sender.parsedFilesList = "";
            }

            sender.drawFilesList();
        };

        _proto.drawFilesList = function drawFilesList() {
            if (this.uploadSpan == undefined) {
                this.filesItem =  document.getElementById("filesitem" + this.thing.thingnickname);
                this.uploadSpan = headerPanelUI.addButton("uploadfilebuttoon", "fa fa-file", getLang("upload"), headerPanelUI.filesButtonRole);                                                    
                this.uploadSpan.href = boardhost + "upload";
                this.uploadSpan.onclick = this.uploadClick;
                this.uploadSpan.setAttribute("data-toggle", "modal");
                this.uploadSpan.setAttribute("data-target", "#uploadModal");                
                this.uploadSpan.filesList = this;
                this.filesItem.href.uploadSpan = this.uploadSpan;
                
            }

            if (this.tableDiv == undefined) {
                this.tableDiv = this.filesAnchors.appendChild(document.createElement('div'));
            }

            this.tableDiv.innerHTML = "";

            if (this.parsedFilesList !== "") {
                this.uploadSpan.className = "btn btn-success btn-sm";
                var table = this.tableDiv.appendChild(document.createElement('table'));
                table.className = "table table-striped table-sm";
                table.id = this.thing.thingnickname + "filestable";
                table.cellspacing = "0";
                var thead = table.appendChild(document.createElement('thead'));
                var tr = thead.appendChild(document.createElement('tr'));
                var th = tr.appendChild(document.createElement('th'));
                th.className = "w-2";
                th.innerText = "#";
                th.scope = "col";
                th = tr.appendChild(document.createElement('th'));
                th.className = "w-10";
                th.innerText = getLang("name");
                th.scope = "col";
                th = tr.appendChild(document.createElement('th'));
                th.className = "w-5";
                th.innerText = getLang("size");
                th.scope = "col";
                th = tr.appendChild(document.createElement('th')); //th.className = "w-50";

                th.innerText = "";
                th.scope = "col";
                var tbody = table.appendChild(document.createElement('tbody'));
                var filesCount = 1;

                for (var i = 0; i < this.parsedFilesList.length; i++) {
                    if (this.parsedFilesList[i] === "") continue;
                    var parsedFile = this.parsedFilesList[i].split(" ");
                    if (parsedFile[0].indexOf("/") == 0)
                    {
                        parsedFile[0] = parsedFile[0].substring(1, parsedFile[0].length);
                    }
                    var tr = tbody.appendChild(document.createElement('tr'));
                    var th = tr.appendChild(document.createElement('th'));
                    th.scope = "row";
                    th.innerHTML = filesCount;
                    filesCount++;
                    var nameTd = tr.appendChild(document.createElement('td'));
                    var downloadHref = nameTd.appendChild(document.createElement('a'));
                 //Old version   
                 //   downloadHref.href = boardhost + "downloadfile?name=" + parsedFile[0];
                    downloadHref.href = boardhost + parsedFile[0];
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
                    deleteSpan.onclick = this.deleteClick;
                    deleteSpan.innerText = "del";
                    deleteSpan.filesList = this;
                }

                $("#" + this.thing.thingnickname + "filestable").DataTable({
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
            } else {
                this.uploadSpan.className = "btn btn-secondary btn-sm";
            }
        };

        _proto.deleteClick = function deleteClick(event) {
            event.stopPropagation();
            var deleteButton = event.currentTarget;
            deleteButton.className = "badge badge-warning";
            deleteButton.value = 'do...';
            deleteButton.disable = true;
            var httpResult = deleteFile(deleteButton.filesList.thing.host, deleteButton.filename);

            if (httpResult == 1) {
                deleteButton.filesList.requestFilesList();
            } else {
                deleteButton.className = "badge badge-danger";
                deleteButton.value = 'bad';
            }

            deleteButton.disable = false;
            return false;
        };

        _proto.uploadClick = function uploadClick(event) {
            event.stopPropagation();
            var uploadFilesDialog = createModalDialog(getLang("uploadfiles"), "");
            uploadFilesDialog.filesListObject = event.currentTarget.filesList;
            var inputGroup = uploadFilesDialog.body.appendChild(document.createElement("form"));
            inputGroup.className = "form-group";
            inputGroup.id = "inputGroup";
            inputGroup.addEventListener('submit', uploadFilesDialog.filesListObject.inputGroupSubmit);
            inputGroup.filesListObject = uploadFilesDialog.filesListObject;
            var inputgroupprepend = inputGroup.appendChild(document.createElement("div"));
            inputgroupprepend.className = "input-group-prepend";
            var customFile = inputGroup.appendChild(document.createElement("div"));
            customFile.className = "custom-file  form-control-sm";
            var label = customFile.appendChild(document.createElement("label"));
            label.className = "custom-file-label";
            label.setAttribute("for", "inputGroupFile01");
            label.innerText = getLang("selectfiles");
            var fileInput = customFile.appendChild(document.createElement("input"));
            fileInput.className = "custom-file-input";
            fileInput.id = "inputGroupFile01";
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("aria-describedby", "inputGroupFileAddon01");
            fileInput.multiple = true;
            fileInput.onchange = uploadFilesDialog.filesListObject.inputGroupChange;
            fileInput.filesListObject = uploadFilesDialog.filesListObject;
            var filesList = customFile.appendChild(document.createElement("div"));
            filesList.id = "filesList";
            fileInput.filesList = filesList;
            fileInput.label = label;
            fileInput.customFile = customFile;

            uploadFilesDialog.OKButton.style.display = "none";
            uploadFilesDialog.show();

            return false;
        };

        _proto.formatBytes = function formatBytes(x) {
            var l = 0,
                n = parseInt(x, 10) || 0;

            while (n >= 1024 && ++l) {
                n = n / 1024;
            }

            return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + things[l];
        };

        _proto.inputGroupChange = function inputGroupChange(event) {
            var fileInput = event.currentTarget;
            var filesListObject = fileInput.filesListObject;
            var filesList = fileInput.filesList;
            var label = fileInput.label;
            filesList.innerHTML = "";
            var files = fileInput.files;
            var totalSize = 0;

            for (var i = 0; i < files.length; i++) {
                var fileItem = filesList.appendChild(document.createElement("div"));
                fileItem.id = files[i].name + "fileItem";
                fileItem.innerHTML += "<b>" + files[i].name + "</b> " + filesListObject.formatBytes(files[i].size + " ");
                totalSize += files[i].size;
            }

            filesList.appendChild(document.createElement("div")).innerHTML += "<br>";
            filesListObject.uploadFileButton = filesList.appendChild(document.createElement("button"));
            filesListObject.uploadFileButton.className = "btn btn-success btn-sm";
            filesListObject.uploadFileButton.id = "doUploadButton";
            filesListObject.uploadFileButton.setAttribute("type", "submit");
            filesListObject.uploadFileButton.innerText = getLang("upload");
            filesListObject.uploadFileButton.used = false;
            label.innerText = files.length + " file(s) selected, size " + filesListObject.formatBytes(totalSize);
        };

        _proto.uploadFileByIndex = function uploadFileByIndex(index) {
            var endPoint = this.thing.host + "uploadfile"; //war mode

            var inputGroup = document.getElementById("inputGroup");
            var inputFile = document.getElementById("inputGroupFile01");
            var filesList = document.getElementById("filesList");
            var files = inputFile.files;

            if (index >= files.length) {
                this.uploadFileButton = document.getElementById("doUploadButton");
                this.uploadFileButton.innerText = "complete";
                return;
            }

            var fileItem = document.getElementById(files[index].name + "fileItem");
            if (fileItem == null) return;
            var formData = new FormData(inputGroup);
            formData.append(files[index].name, files[index], files[index].name);
            var request = new XMLHttpRequest();
            request.fileItem = fileItem;
            request.filesListObject = this;

            request.onloadend = function (oEvent) {
                if (this.readyState == 4) fileItem.innerHTML += " done"; else if (this.status != 0) {
                    fileItem.innerHTML += this.status + " " + this.responseText;
                }
                this.filesListObject.uploadFileByIndex(++index);
            };

            request.onprogress = function (oEvent) {
                if (this.status == 0) return;
                fileItem.innerHTML += ".";
            };

            request.onloadstart = function (oEvent) {
                if (this.readyState == 1) {
                    fileItem.innerHTML += ".";
                }
            };
            request.onabort = function (oEvent) {
                if (this.status == 0) return;
                fileItem.innerHTML += " abort";
            };

            request.onerror = function (oEvent) {
                if (this.status == 0) return;
                fileItem.innerHTML += " error";
            };

            request.ontimeout = function (oEvent) {
                if (this.status == 0) return;
                fileItem.innerHTML += " timeout";
            };

            request.onreadystatechange = function (oEvent) {
                fileItem.innerHTML += ".";
            };

            request.onload = function (oEvent) {
                if (request.status == 200) {
                    fileItem.innerHTML += "OK";
                } else if (request.status == 503) {
                    fileItem.innerHTML += "can't create file";
                } else if (request.status == 503) {
                    fileItem.innerHTML += "aborted";
                } else {
                    fileItem.innerHTML += request.status + " error";
                }
            };
            request.open("POST", endPoint, true);
            request.send(formData);
        };
        _proto.inputGroupSubmit = function inputGroupSubmit(event) {
            var filesListObject = event.currentTarget.filesListObject;

            if (!filesListObject.uploadFileButton.used) {
                filesListObject.uploadFileButton.used = true;
                filesListObject.uploadFileButton.className = "btn btn-default btn-sm";
                filesListObject.uploadFileButton.setAttribute("type", "");
                filesListObject.uploadFileButton.innerText = "in progress...";
                filesListObject.uploadFileButton.disable = true;
                filesListObject.uploadFileByIndex(0);
            }

            event.preventDefault();
        };
        return FilesList;
    }();