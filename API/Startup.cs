using System;
using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Persistence;
using FluentValidation;
using FluentValidation.AspNetCore;
using API.Middleware;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddSwaggerGen(setupAction =>
            {

                setupAction.SwaggerDoc("ReactivitiesAPI",
                new OpenApiInfo()
                {
                    Title = "Reactivities API",
                    Version = "1.0",
                    Description = "Swagger adding skill testing",
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact()
                    {
                        Email = "inatoff.spam@gmail.com",
                        Name = "Inatov Rustam",
                        Url = new Uri("https://www.twitter.com/inat0ff")
                    },
                    License = new Microsoft.OpenApi.Models.OpenApiLicense()
                    {
                        Name = "MIT License",
                        Url = new Uri("https://opensource.org/licenses/MIT")
                    }
                });
                setupAction.CustomSchemaIds(x => x.FullName);
            });

            services.AddControllers().AddFluentValidation(cfg => 
            {
                cfg.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleWare>();
            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            app.UseCors("CorsPolicy");
            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();

            app.UseSwaggerUI(setupAction =>
            {
                setupAction.SwaggerEndpoint(
                    "/swagger/ReactivitiesAPI/swagger.json",
                    "Reactivities API");
            });
        }
    }
}
