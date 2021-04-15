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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{
    public class OWLOSFiles
    {
        public List<OWLOSFile> filesList = new List<OWLOSFile>();
        public delegate void NewFileEventHandler(object sender, OWLOSFile owlosFile);
        public event NewFileEventHandler OnNewFile;
        public OWLOSThing parentThing;

        public OWLOSFiles(OWLOSThing parentThing)
        {
            this.parentThing = parentThing;
        }

        public async Task ParseGetAllFiles(string filesData)
        {            

            List<string> filesRaw = filesData.Split('\n').ToList();

            foreach (OWLOSFile owlosExistedFileInitial in filesList)
            {
                owlosExistedFileInitial.exist = false;
            }

            foreach (string file in filesRaw)
            {

                if (file.IndexOf("/") != -1)
                {
                    string currentFileName = file.Substring(1, file.IndexOf(" ") - 1);

                    bool isFileExisted = false;

                    foreach (OWLOSFile owlosExistedFile in this.filesList)
                    {
                        if (owlosExistedFile.name.Equals(currentFileName))
                        {
                            isFileExisted = true;

                            owlosExistedFile.exist = true; 

                            if (int.TryParse(file.Substring(file.IndexOf(" ")), out int rawFileSize))
                            {
                                owlosExistedFile.networkStatus = NetworkStatus.Online;
                                if (owlosExistedFile.size != rawFileSize)
                                {
                                    owlosExistedFile.size = rawFileSize;
                                }

                            }
                            else
                            {
                                owlosExistedFile.networkStatus = NetworkStatus.Erorr;
                            }

                            break;
                        }
                    }

                    if (!isFileExisted)
                    {
                        AddFile(file);
                    }
                }
            }

            //Delete files
            while(true) 
            {
                bool allFileDeleted = false;
            
                foreach (OWLOSFile owlosExistedFileDelete in filesList)
                {
                    if (!owlosExistedFileDelete.exist)
                    {
                        owlosExistedFileDelete.FileDeleteOutSide();
                        allFileDeleted = true;
                        this.filesList.Remove(owlosExistedFileDelete);
                        break;
                    }
                }

                if (!allFileDeleted)
                {
                    break;
                }
            }
        }

        private bool AddFile(string rawFile)
        {
            bool addFileResult = true;

            string rawFileName = rawFile.Substring(1, rawFile.IndexOf(" ") - 1); ;

            if (!string.IsNullOrEmpty(rawFile))
            {
                
                if (int.TryParse(rawFile.Substring(rawFile.IndexOf(" ")), out int rawFileSize)) { 

                    OWLOSFile owlosNewFile = new OWLOSFile();
                    owlosNewFile.name = rawFileName;
                    owlosNewFile.size = rawFileSize;
                    filesList.Add(owlosNewFile);
                    OnNewFile?.Invoke(this, owlosNewFile);
                    owlosNewFile.networkStatus = NetworkStatus.Online;
                }
                else
                {
                    addFileResult = false;
                }

            }

            return addFileResult;
        }

        public async Task<bool> DeleteFile(string rawFile)
        {
            OWLOSFile file = filesList.FirstOrDefault(f => f.name == rawFile && f.exist);

            if (file != null)
            {
                if (await parentThing.DeleteFile(rawFile))
                {
                    file.FileDeleteInsideSide();
                    return true;
                }
            }

           return false;

        }

    }
}
