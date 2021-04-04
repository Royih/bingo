using System;
using System.Threading.Tasks;
using Bingo.Infrastructure.Models;
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

    public class ComHub : Hub
    {
        private readonly IConfiguration _configuration;
        private readonly IHubContext<ComHub> _hubContext;
        private readonly ICurrentUser _currentUser;
        private readonly IHttpContextAccessor _ctx;
        private readonly IMediator _mediator;

        public ComHub(IConfiguration configuration, IHubContext<ComHub> hubContext, ICurrentUser currentUser, IHttpContextAccessor ctx, IMediator mediator)
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

        public override async Task OnConnectedAsync()
        {
            Log.Information("{0}_ User connected. ", DateTime.Now);
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Log.Information("{0}_ User disconnected.", DateTime.Now);
            await base.OnDisconnectedAsync(exception);
        }


    }
}