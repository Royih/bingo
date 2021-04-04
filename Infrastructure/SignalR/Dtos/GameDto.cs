using System;

namespace Bingo.Infrastructure.SignalR.Dtos
{
    public class GameDto
    {
        public string Id { get; set; }
        public string CreatedByConnectionId { get; set; }
        public string CreatedByName { get; set; }
        public string Name { get; set; }
        public int Players { get; set; }

    }

}