using OWLOSAdmin.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Controls;
using System.Windows.Media;

namespace OWLOSAdmin.EcosystemExplorer.EcosystemControls
{
   public class OWLOSFileControl: OWLOSPanelControl
    {
        private OWLOSFiles files;

        public OWLOSFileControl(OWLOSFiles files) : base()
        {
            this.files = files;
            panelName.Text = "files";
            foreach(OWLOSFile file in files.filesList)
            {
                TextBlock textBlock = new TextBlock();
                textBlock.Foreground = Foreground = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
                textBlock.Text = file.name + " " + file.size.ToString();
                textBlock.Tag = file;
                file.tag = textBlock;
                file.OnFileSizeChange += File_OnFileSizeChange;
                file.OnFileDelete += File_OnFileDelete;
                propertiesHolder.Children.Add(textBlock);
            }

            files.OnNewFile += Files_OnNewFile;
        }

        private void File_OnFileDelete(object sender, EventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {

                OWLOSFile file = sender as OWLOSFile;
                TextBlock textBlock = file.tag as TextBlock;
                propertiesHolder.Children.Remove(textBlock);
                textBlock = null;
            });

        }

        private void File_OnFileSizeChange(object sender, int size)
        {
            base.Dispatcher.Invoke(() =>
            {

                OWLOSFile file = sender as OWLOSFile;
                TextBlock textBlock = file.tag as TextBlock;
                textBlock.Text = file.name + " " + file.size.ToString();
            });
        }

        private void Files_OnNewFile(object sender, OWLOSFile owlosFile)
        {
            base.Dispatcher.Invoke(() =>
            {
                TextBlock textBlock = new TextBlock();
                textBlock.Foreground = Foreground = (SolidColorBrush)App.Current.Resources["OWLOSInfo"];
                textBlock.Text = owlosFile.name + " " + owlosFile.size.ToString();
                textBlock.Tag = owlosFile;
                owlosFile.tag = textBlock;
                propertiesHolder.Children.Add(textBlock);
            });

        }
    }
}
