
using System.Collections.Generic;
using Bingo.Infrastructure.SignalR.Dtos;

namespace Bingo.Infrastructure.SignalR.Messages
{
    public class GameListModifiedMsg
    {
        public IEnumerable<GameDto> Games { get; set; }
    }
}