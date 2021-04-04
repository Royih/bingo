using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bingo.Infrastructure.Models;
using Bingo.Infrastructure.SignalR.Dtos;
using Bingo.Infrastructure.SignalR.Messages;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace Bingo.Infrastructure.SignalR
{
    public class TestMessageDto
    {
        public string UserName { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Message { get; set; }
    }

    public class BingoHub : Hub
    {
        private readonly IConfiguration _configuration;
        private readonly IHubContext<BingoHub> _hubContext;
        private readonly ICurrentUser _currentUser;
        private readonly IHttpContextAccessor _ctx;
        private readonly IMediator _mediator;

        private readonly static List<GameDto> _games = new List<GameDto>();
        private readonly static List<ConnectionDto> _connections = new List<ConnectionDto>();

        public BingoHub(IConfiguration configuration, IHubContext<BingoHub> hubContext, ICurrentUser currentUser, IHttpContextAccessor ctx, IMediator mediator)
        {
            _configuration = configuration;
            _hubContext = hubContext;
            _currentUser = currentUser;
            _ctx = ctx;
            _mediator = mediator;
        }

        public async void SendMessage(TestMessageDto message)
        {
            Log.Information("Her...{0}. {1}", message?.Message ?? "Empty message", _ctx.HttpContext.User.Identity.Name);
            await _hubContext.Clients.All.SendAsync("SendMessage", message);
        }

        public async Task AddGame(AddGameMsg message)
        {
            var conn = _connections.Single(x => x.ConnectionId == Context.ConnectionId);
            Log.Information("Adding game with name: {0}. {1}", message.Name ?? "Empty message", Context.ConnectionId);
            _games.Add(new GameDto { Id = Guid.NewGuid().ToString(), Name = message.Name, CreatedByConnectionId = Context.ConnectionId, CreatedByName = conn.PlayerName });
            await _hubContext.Clients.All.SendAsync("GameListModified", new GameListModifiedMsg { Games = _games });
        }
        public async Task JoinGame(JoinGameMsg message)
        {
            var conn = _connections.Single(x => x.ConnectionId == Context.ConnectionId);
            var game = _games.Single(x => x.Id == message.GameId);
            Log.Information("{0} is joining game {1}", conn.PlayerName, game.Name);
            game.Players++;
            conn.GameId = message.GameId;
            await _hubContext.Clients.All.SendAsync("GameListModified", new GameListModifiedMsg { Games = _games });
            await _hubContext.Clients.All.SendAsync("ConnectionsModified", new ConnectionsModifiedMsg { Connections = _connections });
        }



        public async Task RegisterPlayerName(RegisterPlayerNameMsg message)
        {
            var existing = _connections.SingleOrDefault(x => x.ConnectionId == Context.ConnectionId);
            existing.PlayerName = message.PlayerName;
            await _hubContext.Clients.All.SendAsync("ConnectionsModified", new ConnectionsModifiedMsg { Connections = _connections });
        }



        public override async Task OnConnectedAsync()
        {
            Log.Information("{0}_ User connected. ", DateTime.Now);
            await base.OnConnectedAsync();
            _connections.Add(new ConnectionDto { ConnectionId = Context.ConnectionId });
            await _hubContext.Clients.Client(Context.ConnectionId).SendAsync("GameListModified", new GameListModifiedMsg { Games = _games });
            await _hubContext.Clients.All.SendAsync("ConnectionsModified", new ConnectionsModifiedMsg { Connections = _connections });
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Log.Information("{0}_ User disconnected.", DateTime.Now);
            await base.OnDisconnectedAsync(exception);
            var existing = _connections.SingleOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (existing != null)
            {
                _connections.Remove(existing);
                await _hubContext.Clients.All.SendAsync("ConnectionsModified", new ConnectionsModifiedMsg { Connections = _connections });
            }
            var gamesToRemove = _games.Where(x => x.CreatedByConnectionId == Context.ConnectionId).ToArray();
            foreach (var game in gamesToRemove)
            {
                _games.Remove(game);
            }
            await _hubContext.Clients.All.SendAsync("GameListModified", new GameListModifiedMsg { Games = _games });
        }


    }
}