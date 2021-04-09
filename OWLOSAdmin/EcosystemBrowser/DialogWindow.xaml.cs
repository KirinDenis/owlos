using System.Windows;
using System.Windows.Input;

namespace OWLOSAdmin.EcosystemBrowser
{
    public partial class DialogWindow : Window
    {
        public DialogWindow(string HeaderText, string BodyText)
        {
            InitializeComponent();

            HeaderTextBlock.Text = HeaderText;
            BodyTextBlock.Text = BodyText;
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }

        private void OKButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
            Close();
        }

        private void Window_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
            {
                DialogResult = false;
                Close();
            }
            else
            if (e.Key == Key.Enter)
            {
                DialogResult = true;
                Close();
            }
        }

    }
}
