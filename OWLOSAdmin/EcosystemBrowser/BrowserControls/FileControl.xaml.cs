using OWLOSThingsManager.Ecosystem.OWLOS;
using OWLOSThingsManager.EcosystemBrowser.BrowserControls;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{
    public class FileItem
    {
        public ListView ParentListView;
        public bool IsChecked { get; set; }
        public string FileName { get; set; }
        public int FileSize { get; set; }
        public string LastOperation { get; set; }

        /*
        public void OwlosFile_OnFileDelete(object sender, EventArgs e)
        {
            ParentListView.Items.Remove(this);
        }
        */
    }

    public partial class FileControl : UserControl
    {

        public PanelControl ThingPanelControl;

        private PanelControlTag PanelTag;
        public FileControl(PanelControlTag PanelTag)
        {
            InitializeComponent();
            
            ThingPanelControl = new PanelControl(PanelTag);
            ThingPanelControl.ContentHolder.Children.Add(this);

            this.PanelTag = PanelTag;

            foreach (OWLOSFile File in PanelTag.Thing.files.filesList)
            {
                FileItem Item;
                Item = new FileItem()                
                {                    
                    ParentListView = FilesListView,
                    FileName = File.name,
                    FileSize = File.size,
                    LastOperation = DateTime.Now.ToString(),                    
            };
                //File.OnFileDelete += Item.OwlosFile_OnFileDelete;
                PanelTag.Thing.files.OnNewFile += Files_OnNewFile;

                FilesListView.Items.Add(Item);
            }

            

        }

        private void Files_OnNewFile(object sender, OWLOSFile owlosFile)
        {
            FileItem Item = new FileItem()
            {
                ParentListView = FilesListView,
                FileName = owlosFile.name,
                FileSize = owlosFile.size,
                LastOperation = DateTime.Now.ToString()
            };

            FilesListView.Items.Add(Item);

            //owlosFile.OnFileDelete += Item.OwlosFile_OnFileDelete;
        }


        private async void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            foreach(FileItem Item in FilesListView.Items)
            {
                if (Item.IsChecked)
                {
                    await PanelTag.Thing.files.DeleteFile(Item.FileName);
                }
            }
            
        }
    }
}
