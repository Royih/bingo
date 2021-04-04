using System;
using System.Reflection;
using Bingo.DataAccess;
using Bingo.Infrastructure;
using Bingo.Infrastructure.CustomIdentity;
using Bingo.Infrastructure.Models;
using Bingo.Infrastructure.SignalR;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
namespace Bingo
{
    public class Startup
    {
        readonly string MyCorsPolicy = "MyCorsPolicy";
        private bool IsDevelopment { get; set; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            IsDevelopment = env.IsDevelopment();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Add DI Implementations
            services.AddScoped<IDb, Db>();
            services.AddScoped<IAppRepository, AppRepository>();
            services.AddScoped<ICurrentUser, CurrentUser>();

            //services.AddSingleton<BackgroundWorker>();

            services.AddCustomIdentity(Configuration);

            // Add Cors support
            services.AddCors(o => o.AddPolicy(MyCorsPolicy, builder =>
            {
                builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:3000", "https://192.168.1.12:8080");
            }));

            //https://github.com/jbogard/MediatR/wiki
            services.AddMediatR(Assembly.GetEntryAssembly());

            services.AddSignalR();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSerilogRequestLogging();

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            //RIH: Required and in this specific order
            app.UseAuthentication();
            app.UseCors(MyCorsPolicy);
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");

                endpoints.MapHub<ComHub>("/comhub");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseReactDevelopmentServer(npmScript: "start"); 
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });

            serviceProvider.SeedDb(Configuration);

            Log.Information("Ready!");
        }
    }
}