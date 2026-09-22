// W503: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v3
namespace DotnetWeb;
public static class W503{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v3"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v3");return true;
}
}
