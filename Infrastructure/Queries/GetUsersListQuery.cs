using System.Collections.Generic;
using System.Linq;
using Bingo.Infrastructure.Models;
using MediatR;

namespace Bingo.Infrastructure.Queries
{

    public class GetUsersListQuery : IRequest<IEnumerable<UserDto>>
    { }

    public class GetUsersListQueryHandler : RequestHandler<GetUsersListQuery, IEnumerable<UserDto>>
    {
        private readonly IAppRepository _repo;

        public GetUsersListQueryHandler(IAppRepository repo)
        {
            _repo = repo;
        }

        protected override IEnumerable<UserDto> Handle(GetUsersListQuery query)
        {
            var t = _repo.ListUsers().Select(x => x.Map());
            return t;
        }
    }
}