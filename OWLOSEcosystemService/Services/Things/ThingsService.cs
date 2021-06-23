using OWLOSEcosystemService.Models.Things;
using OWLOSThingsManager.Ecosystem;
using OWLOSThingsManager.Ecosystem.OWLOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OWLOSEcosystemService.Services.Things
{
    public class ThingsServices
    {
        public static ThingsManager thingsManager = null;
        public static void Start()
        {
            thingsManager = new ThingsManager();
            thingsManager.OnNewThing += ThingsManager_OnNewThing;
            thingsManager.Load();
        }

        public static List<ThingPropertiesModel> GetThings()
        {
            List<ThingPropertiesModel> result = new List<ThingPropertiesModel>();

            int temporaryIdCount = 1;

            foreach (OWLOSThingWrapper wrapper in thingsManager.OWLOSThingWrappers)
            {
                result.Add(new ThingPropertiesModel()
                { 
                    Id = temporaryIdCount,
                    Name = wrapper.Thing.Name,
                    Features = wrapper.Thing.Features,
                    Transports = wrapper.Thing.transports,
                    Config = wrapper.Thing.config
                });
                temporaryIdCount++;
            }

            return result;
        }

        public static string GetThingsDrivers()
        {
            string result = string.Empty;
            foreach (OWLOSThingWrapper wrapper in thingsManager.OWLOSThingWrappers)
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
        private static void ThingsManager_OnNewThing(object sender, OWLOSThingWrapperEventArgs e)
        {
            if (e.ThingWrapper != null)
            {

            }
        }
    }
}
