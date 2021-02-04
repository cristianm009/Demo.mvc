﻿const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .configureLogging(signalR.LogLevel.Information)
    .build();

var urlParams = new URLSearchParams(window.location.search);
const group = urlParams.get('group') || "Chat_Home";
document.getElementById('room-name').innerText = group;

connection.on("ReceiveMessage", (user, message) => {
    const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const fecha = new Date().toLocaleTimeString();
    const mensajeAMostrar = fecha + " <strong>" + user + "</strong>:" + msg;
    const li = document.createElement("li");
    li.innerHTML = mensajeAMostrar;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(() => {
    connection.invoke("AddToGroup", group).catch(err => console.error(err.toString()));
}).catch(err => {
    console.error(err.toString());
});


document.getElementById("sendButton").addEventListener("click", event => {

    
    if (connection.connection.connectionState !== "Connected") {
        alert("You are not connected");
        return;
    }

    const user = document.getElementById("userInput").value;
    const message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message, group).catch(err => console.error(err.toString()));
    event.preventDefault();
});