using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace OWLOSEcosystemService
{
    //https://stackoverflow.com/questions/46940710/getting-value-from-appsettings-json-in-net-core
    internal static class ConfigurationManager
    {
        public static IConfiguration AppSetting { get; }
        static ConfigurationManager()
        {
            AppSetting = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile(@"appSettings.json")
                    .Build();
        }
    }

    public class Program
    {
        public static void Main(string[] args)
        {           
            CreateHostBuilder(args).Build().Run();           
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
.ConfigureWebHostDefaults(webBuilder =>
{
webBuilder.UseStartup<Startup>();
webBuilder.UseUrls(ConfigurationManager.AppSetting.GetValue<string>("UseURLS:HTTP"), ConfigurationManager.AppSetting.GetValue<string>("UseURLS:HTTPS"));
});
        }
    }
}
