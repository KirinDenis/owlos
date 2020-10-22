using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;

using System.Threading.Tasks;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace OWLOS_WPF_3
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private string RESTfulServerHost = "http://192.168.1.12/";
        public MainWindow()
        {
            InitializeComponent();

            this.Left = System.Windows.SystemParameters.WorkArea.Width - this.Width;
            this.Top = 0;
            this.Height = System.Windows.SystemParameters.WorkArea.Height;

            Timer lifeCycleTimer = new Timer(1000);
            lifeCycleTimer.AutoReset = true;
            lifeCycleTimer.Elapsed += new ElapsedEventHandler(OnLifeCycleTimer);
            lifeCycleTimer.Start();

        }



        private async void OnLifeCycleTimer(Object source, ElapsedEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                temp.Text = HTTPGet("getdriverproperty?id=dht11&property=temperature");

                Application.Current.Dispatcher.Invoke(DispatcherPriority.Background,
                                                          new Action(delegate { }));

                hum.Text = HTTPGet("getdriverproperty?id=dht11&property=humidity");

                Application.Current.Dispatcher.Invoke(DispatcherPriority.Background,
                                                          new Action(delegate { }));
                heat.Text = HTTPGet("getdriverproperty?id=dht11&property=heatindex");

                Application.Current.Dispatcher.Invoke(DispatcherPriority.Background,
                                                          new Action(delegate { }));

                light.Text = HTTPGet("getdriverproperty?id=light&property=data");


                
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
                return "error" ;
            }

        }

    }
}
