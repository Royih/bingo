
using System.Collections.Generic;
using Bingo.Infrastructure.SignalR.Dtos;

namespace Bingo.Infrastructure.SignalR.Messages
{
    public class ConnectionsModifiedMsg
    {
        public IEnumerable<ConnectionDto> Connections { get; set; }
    }
}