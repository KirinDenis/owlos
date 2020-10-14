using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Timers;
using System.Windows;

namespace OWLOS_WPF_1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        private string RESTfulServerHost = "http://192.168.1.101/";
        private Timer lifeCycleTimer;
        public MainWindow()
        {
            InitializeComponent();

            Timer lifeCycleTimer = new Timer(1000);
            lifeCycleTimer.AutoReset = true;
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
         //   lifeCycleTimer.Start();
            

        }

        private async void OnLifeCycleTimer(Object source, ElapsedEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                int light = int.Parse(HTTPGet("getdriverproperty?id=sensordriver&property=data"));
                if (light < 400)
                {
                    label.Text += HTTPGet("setdriverproperty?id=actuatordriver&property=data&value=1");
                }    
            });
        }


        private string HTTPGet(string param)
        {
            try
            {
                HttpClient client = new HttpClient();

                HttpResponseMessage response = client.GetAsync(RESTfulServerHost + param).Result;

                response.EnsureSuccessStatusCode();
                return response.Content.ReadAsStringAsync().Result;
            }
            catch (Exception exception)
            {
                return "Error:" + exception.Message;
            }

        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            label.Text += HTTPGet("getdriverproperty?id=actuatordriver&property=data");
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            label.Text += HTTPGet("setdriverproperty?id=actuatordriver&property=data&value=1");
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            label.Text += HTTPGet("setdriverproperty?id=actuatordriver&property=data&value=0");
        }
    }
}
