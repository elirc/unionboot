// W507: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v7
namespace DotnetWeb;
public static class W507{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v7"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v7");return true;
}
}
