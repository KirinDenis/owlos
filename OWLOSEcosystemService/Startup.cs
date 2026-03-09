using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using OWLOSEcosystemService.Data;
using OWLOSEcosystemService.Services.Things;
using System;
//artic
namespace OWLOSEcosystemService
{
    public class Startup
    {
        public Startup()
        {

        }   
        
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string connectionString = ConfigurationManager.AppSetting.GetConnectionString("DefaultConnection");
           
            services.AddDbContext<ApplicationDbContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
            services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddDbContext<ThingsDbContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            DbContextOptionsBuilder op = new DbContextOptionsBuilder();
            
            op.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), op => op.EnableRetryOnFailure());


            new ThingsDbContext(op.Options);

            services.AddControllersWithViews();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "OWLOS Air Quality API",
                    Version = "v1",
                    Description = "An API to perform OWLOS Air Quality",                    
                    Contact = new OpenApiContact
                    {
                        Name = "OWLOS",
                        Email = "deniskirinacs@gmail.com",
                        Url = new Uri("https://github.com/KirinDenis/owlos"),
                    },
                    License = new OpenApiLicense
                    {
                        Name = "GPL-3.0 License",
                        Url = new Uri("https://github.com/KirinDenis/owlos/blob/master/LICENSE"),
                    }
                });

            });

            TypeAdapterConfig config = new TypeAdapterConfig();
            // Or
            // var config = TypeAdapterConfig.GlobalSettings;
            services.AddSingleton(config);
            services.AddScoped<IMapper, ServiceMapper>();

            //Thing service 
            services.AddSingleton< IThingsService, ThingsService>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "OWLOS Air Quality APIs");
                //c.SupportedSubmitMethods(new Swashbuckle.AspNetCore.SwaggerUI.SubmitMethod[] { });
            });


            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
                //endpoints.MapControllerRoute(name: "things", pattern: "Things/{*GetThings}", defaults: new { controller = "Things", action = "GetThings" });
                endpoints.MapRazorPages();
            });
        }
    }
}
