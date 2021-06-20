using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OWLOSEcosystemService.Models;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace OWLOSEcosystemService.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public string GetThings()
        {
            string result = string.Empty;
            foreach (OWLOSThingWrapper wrapper in OWLOSThreadThingManager.thingsManager.OWLOSThingWrappers)
            {
                result += "thing: " + wrapper.Thing.Name + "\n";
                foreach (OWLOSDriver driver in wrapper.Thing.drivers)
                {
                    result += " - driver: " + driver.name + "\n";
                    for (int i = 0; i < driver.properties.Count; i++)
                    {
                        result += " -- " + driver.properties[i].name + ":" + driver.properties[i].value + " flags: " + driver.properties[i].flags + "\n";
                    }
                }
            }
            
            return result;
        }


        public IActionResult Index()
        {
            var claims = User.Claims;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
