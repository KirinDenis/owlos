using System;
using System.Collections.Generic;
using System.Dynamic;
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

namespace OWLOSThingsManager
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    /// 

    public partial class MainWindow : Window
    {

        private dynamic driver = new ExpandoObject();
        private int count = 0;
        private int exCount = 0;
        public MainWindow()
        {
            InitializeComponent();

            Timer t = new Timer(1000);
            t.AutoReset = true;
            t.Elapsed += new ElapsedEventHandler(OnTimedEvent);
            t.Start();

            /*
            System.Windows.Threading.DispatcherTimer dispatcherTimer = new System.Windows.Threading.DispatcherTimer();
            dispatcherTimer.Tick += dispatcherTimer_Tick;
            dispatcherTimer.Interval = new TimeSpan(0, 0, 0, 0, 10);
            dispatcherTimer.Start();
            */
        }

        private async void OnTimedEvent(Object source, ElapsedEventArgs e)
        {
            try
            {
                HttpClient client = new HttpClient();
                HttpResponseMessage response = await client.GetAsync("http://192.168.1.5/getalldriversproperties");
                //HttpResponseMessage response = client.GetAsync("http://192.168.1.5/getfilelist").Result;


                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                // Above three lines can be replaced with new helper method below
                // string responseBody = await client.GetStringAsync(uri);

                //Console.WriteLine(responseBody);
                this.Dispatcher.Invoke(() =>
                {
                    log.Content = responseBody;
                    parseDriver(responseBody);
                    count++;
                });
            }
            catch (Exception exception)
            {
                exCount++;
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", exception.Message);
            }
            this.Dispatcher.Invoke(() =>
            {
                this.Title = count.ToString() + " exceptions: " + exCount.ToString();
            });

        }

        private void parseDriver(string driverData)
        {
            List<string> driverRaw = driverData.Split('\n').ToList();
            foreach(string driverProp in driverRaw)
            {
                if (driverProp.IndexOf("=") != -1)
                {
                    string key = driverProp.Substring(0, driverProp.IndexOf("="));
                    string value = driverProp.Substring(driverProp.IndexOf("=")+1);

                    var expandoDict = driver as IDictionary<string, object>;
                    if (expandoDict.ContainsKey(key))
                        expandoDict[key] = value;
                    else
                        expandoDict.Add(key, value);
                    
                }
            }
        }

        private void dispatcherTimer_Tick(object sender, EventArgs e)
        {
        }
    }
}
