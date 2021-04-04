using System.Security.Authentication;
using Bingo.Infrastructure;
using Bingo.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Bingo.DataAccess
{
    public class Db : IDb
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMongoClient _client;
        private readonly IMongoCollection<ApplicationUser> _users;
        private readonly IMongoCollection<RefreshToken> _refreshTokens;

        public Db(IConfiguration config, UserManager<ApplicationUser> userManager)
        {

            var settings = MongoClientSettings.FromUrl(new MongoUrl(config.GetMongoConnectionString()));
            settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
            _client = new MongoClient(settings);
            var database = _client.GetDatabase(config.GetMongoDatabaseName());
            _users = database.GetCollection<ApplicationUser>("users");
            _userManager = userManager;
            _refreshTokens = database.GetCollection<RefreshToken>("refreshTokens");
        }

        public IMongoClient Client => _client;
        public IMongoCollection<ApplicationUser> Users => _users;
        public UserManager<ApplicationUser> UserManager => _userManager;
        public IMongoCollection<RefreshToken> RefreshTokens => _refreshTokens;
    }
}