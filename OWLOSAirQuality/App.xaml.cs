using OWLOSAirQuality.OWLOSEcosystemService;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace OWLOSAirQuality
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        public static OWLOSEcosystemManager EcosystemManager;
        
        void App_Startup(object sender, StartupEventArgs e)
        {
            EcosystemManager = new OWLOSEcosystemManager();            
        }

        public OWLOSEcosystemManager GetEcosystemManager()
        {
            return EcosystemManager;
        }
    }
}
