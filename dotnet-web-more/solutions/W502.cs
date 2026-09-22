// W502: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v2
namespace DotnetWeb;
public static class W502{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v2"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v2");return true;
}
}
