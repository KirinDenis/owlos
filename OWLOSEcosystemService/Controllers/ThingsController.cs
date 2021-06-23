using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OWLOSEcosystemService.Data;
using OWLOSEcosystemService.Models.Things;
using OWLOSEcosystemService.Services.Things;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace OWLOSEcosystemService.Controllers
{
    [Authorize]
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

        /// <summary>
        /// Create a new thing connection 
        /// </summary>
        /// <param name="ConnectionPropertiesModel">new connection properties</param>
        /// <returns></returns>
        [Route("Things/NewThingConnection")]
        [HttpPost]
        public bool NewThingConnection(ThingConnectionPropertiesModel ConnectionPropertiesModel)
        {
            if ((User?.Identity as ClaimsIdentity)?.Claims != null)
            {
                IEnumerable<Claim> claims = (User?.Identity as ClaimsIdentity)?.Claims;

                Guid UserId = new Guid(claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);

                using (ApplicationDbContext db = new ApplicationDbContext())
                {
                    ConnectionPropertiesModel.UserId = UserId;
                    db.Add(ConnectionPropertiesModel);
                    db.SaveChanges();
                }
            }

            return false;
        }
    }
}
