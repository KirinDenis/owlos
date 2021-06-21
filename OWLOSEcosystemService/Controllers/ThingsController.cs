using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OWLOSEcosystemService.Models;
using OWLOSEcosystemService.Models.Things;
using OWLOSEcosystemService.Services.Things;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System.Collections.Generic;
using System.Diagnostics;

namespace OWLOSEcosystemService.Controllers
{
    public class ThingsController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public ThingsController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        
        /// <summary>
        /// Returns list of all things
        /// </summary>
        /// <returns>List of things</returns>
        [Route("Things")]
        [Route("Things/Get")]
        [HttpGet]
        public List<ThingPropertiesModel> Get()
        {
            return ThingsServices.GetThings();
        }

    }
}
