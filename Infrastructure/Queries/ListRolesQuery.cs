using System.Collections.Generic;
using Bingo.Infrastructure.Models;
using MediatR;

namespace Bingo.Infrastructure.Queries
{

    public class ListRolesQuery : IRequest<IEnumerable<UserRoleDto>>
    {

    }

    public class ListRolesQueryHandler : RequestHandler<ListRolesQuery, IEnumerable<UserRoleDto>>
    {
        private readonly IAppRepository _repo;

        public ListRolesQueryHandler(IAppRepository repo)
        {
            _repo = repo;
        }

        protected override IEnumerable<UserRoleDto> Handle(ListRolesQuery query)
        {
            return _repo.ListRoles();
        }
    }
}