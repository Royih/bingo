using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace Bingo.Infrastructure.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    [CollectionName("Users")]
    public class ApplicationUser : MongoIdentityUser
    {
        public string FullName { get; set; }

        public string Culture { get; set; }

    }
}