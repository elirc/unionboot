// W506: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v6
namespace DotnetWeb;
public static class W506{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v6"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v6");return true;
}
}
