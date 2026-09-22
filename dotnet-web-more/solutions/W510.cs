// W510: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v10
namespace DotnetWeb;
public static class W510{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v10"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v10");return true;
}
}
