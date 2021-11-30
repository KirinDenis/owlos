using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSAirQuality.OWLOSEcosystemService
{
    public class OWLOSEcosystemManager
    {
        public List<OWLOSEcosystemServiceClient> OWLOSEcosystemServiceClients = new List<OWLOSEcosystemServiceClient>();

        public OWLOSEcosystemManager()
        {
            OWLOSEcosystemServiceClients.Add(new OWLOSEcosystemServiceClient()
            {
                Name = "OWLOS ORG",
                URL = "http://airquality.owlos.org",
                Token = "WG8xNTc1T29ONTFDbkdUd1NUOU1xVWRqVHhzbGIwOVJFN2xibU5RNnJpMFFBQUFBY3I4SERwTlVKWENsMjF4a1lWZG9OSlJBTDl0aDAwTWUzMk9ub2JYN2YvQUZmMWdESVZ1akE4c3NTUHcwbHkxWVc3bWd0N1JXcVVWTEZYQzRPajYwdTBIdFBVVHBFb0VjeXhyeGZCZWNDRVhmWWpzSTZDamxsdjAzR0dWY0JFL3dRSHZkL2llWE4wcmE4eFJsVFlFdmtRPT0%3D"
            });

            OWLOSEcosystemServiceClients.Add(new OWLOSEcosystemServiceClient()
            {
                Name = "Local",
                URL = "https://192.168.1.100:5004/Things/",
                Token = "Y3JBVnB1aEZBbXRUNEVEY3JsSkRscW9QMnJTdXdDdHZmZlh4YVhMa2Jhd1FBQUFBR0h2NFpkYXFIQXFhM3hlK1IyckpZTXlTNENLSENBb3puZmFJVU5ZSXp6MUhYbGRPd0p0cGtIdlZZNnRaazN6TGxnMGU1RW4yek1hZDlIRnQ4Uk41dXd2WXZrUGUxYzZhNGtwTnA1U0pydXdCTGRjMStnYXE1L2tMYVp2T2RiNWc3TVlEU0NDbW9MQ1hoWGp4eVRsTnVRPT0="
            });

        }
    }
}
