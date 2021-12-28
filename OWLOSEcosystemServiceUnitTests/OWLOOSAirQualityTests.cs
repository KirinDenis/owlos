using Microsoft.VisualStudio.TestTools.UnitTesting;
using OWLOSEcosystemService.Controllers;
using OWLOSEcosystemService.DTO.Things;
using OWLOSEcosystemService.Services.Things;
using System;
using System.Collections.Generic;

namespace OWLOSEcosystemServiceUnitTests
{
    [TestClass]
    public class OWLOOSAirQualityTests
    {
        private const string Token = "";
        private const int ThingId = 3;

        [TestMethod] 
        public void DailyDataTestMethod()
        {
            ThingsService thingsService = new ThingsService();
            ThingsController thingsController = new ThingsController(null, null, thingsService);
            var result = thingsController.GetLastDayThingAQ(Token, ThingId);            
            Assert.IsNotNull(result);
        }
    }
}
