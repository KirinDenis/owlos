using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OWLOSAdmin.Ecosystem.OWLOS
{
    public class OWLOSFiles
    {
        List<OWLOSFile> filesList = new List<OWLOSFile>();
        public delegate void NewFileEventHandler(object sender, OWLOSFile owlosFile);
        public event NewFileEventHandler OnNewFile;


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


        private bool AddFile(String rawFile)
        {
            bool addFileResult = true;

            string rawFileName = rawFile.Substring(1, rawFile.IndexOf(" ") - 1); ;

            if (!String.IsNullOrEmpty(rawFile))
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

    }
}
