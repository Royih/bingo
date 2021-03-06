using System;
using System.Linq;
using System.Threading.Tasks;
using Bingo.DataAccess;
using Bingo.Infrastructure.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using Serilog;

namespace Bingo.Infrastructure
{
    public static class SeedDBExtensions
    {
        private static IDb _db;

        private static IConfiguration _configuration;

        private static async Task<CommandResultDto> DoSeedDb(this IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _db = serviceProvider.GetRequiredService<IDb>();
            var repository = serviceProvider.GetRequiredService<IAppRepository>();
            _configuration = configuration;
            if (!_db.UserManager.Users.Any())
            {
                return await repository.SeedEmptyDatabase();
            }

            Log.Information("DB already seeded.");
            return new CommandResultDto { Success = true };
        }

        public static void SeedDb(this IServiceProvider serviceProvider, IConfiguration configuration)
        {
            var res = serviceProvider.DoSeedDb(configuration).GetAwaiter().GetResult();
            if (!res.Success)
            {
                Log.Error("Error seeding DB.");
                foreach (var err in res.ErrorMessages)
                {
                    Log.Error(err);
                }
            }
            if (res.Messages != null)
            {
                foreach (var msg in res.Messages)
                {
                    Log.Information(msg);
                }
            }
        }

    }
}