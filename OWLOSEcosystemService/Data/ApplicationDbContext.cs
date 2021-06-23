using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OWLOSEcosystemService.Models.Things;
using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSEcosystemService.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        private static DbContextOptions<ApplicationDbContext> options = null;

        public DbSet<ThingConnectionPropertiesModel> ThingConnectionProperties { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        {
            ApplicationDbContext.options = options;
        }

        public ApplicationDbContext(): base(ApplicationDbContext.options)
        {
            
        }

    }
}
