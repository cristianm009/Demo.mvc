﻿using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace DemoMVC.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message, string group)
        {
            await Clients.Group(group).SendAsync("ReceiveMessage", user, message);
        }

        public async Task AddToGroup(string group)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var groups = new string[] { "Chat_Home", "Chat_Sala2" };
            foreach (var group in groups)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);

            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}