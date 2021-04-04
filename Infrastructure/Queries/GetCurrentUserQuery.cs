
using Bingo.Infrastructure.Models;
using MediatR;

namespace Bingo.Infrastructure.Queries
{
    public class GetCurrentUserQuery : IRequest<UserDto>
    {

    }

    public class GetCurrentUserQueryHandler : RequestHandler<GetCurrentUserQuery, UserDto>
    {
        private readonly IAppRepository _repo;

        public GetCurrentUserQueryHandler(IAppRepository repo)
        {
            _repo = repo;
        }

        protected override UserDto Handle(GetCurrentUserQuery query)
        {
            var t = _repo.GetCurrentUser().Map();
            return t;
        }
    }
}