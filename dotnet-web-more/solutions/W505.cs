// W505: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v5
namespace DotnetWeb;
public static class W505{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v5"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v5");return true;
}
}
