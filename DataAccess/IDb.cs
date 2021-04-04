
using Bingo.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;

namespace Bingo.DataAccess
{
    public interface IDb
    {
        IMongoClient Client { get; }
        UserManager<ApplicationUser> UserManager { get; }
        IMongoCollection<RefreshToken> RefreshTokens { get; }
        IMongoCollection<ApplicationUser> Users { get; }

    }
}