// W504: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v4
namespace DotnetWeb;
public static class W504{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v4"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v4");return true;
}
}
