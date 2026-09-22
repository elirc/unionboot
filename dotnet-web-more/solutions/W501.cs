// W501: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v1
namespace DotnetWeb;
public static class W501{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v1"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v1");return true;
}
}
