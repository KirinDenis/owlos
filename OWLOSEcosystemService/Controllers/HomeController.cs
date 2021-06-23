using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OWLOSEcosystemService.Models;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System.Collections.Generic;
using System.Diagnostics;

namespace OWLOSEcosystemService.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            IEnumerable<System.Security.Claims.Claim> claims = User.Claims;
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
