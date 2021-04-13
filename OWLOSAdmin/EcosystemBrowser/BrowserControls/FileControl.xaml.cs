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
        public string FileName { get; set; }
        public int FileSize { get; set; }
        public string LastOperation { get; set; }
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
                FileItem Item = new FileItem()
                {                    
                    FileName = File.name,
                    FileSize = File.size,
                    LastOperation = DateTime.Now.ToString()
                };

                FilesListView.Items.Add(Item);
            }

            PanelTag.Thing.files.OnNewFile += Files_OnNewFile;

        }

        private void Files_OnNewFile(object sender, OWLOSFile owlosFile)
        {
            FileItem Item = new FileItem()
            {
                FileName = owlosFile.name,
                FileSize = owlosFile.size,
                LastOperation = DateTime.Now.ToString()
            };

            FilesListView.Items.Add(Item);
        }

        private void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            //PanelTag.Thing.files.
        }
    }
}
