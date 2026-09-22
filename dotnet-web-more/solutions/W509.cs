// W509: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v9
namespace DotnetWeb;
public static class W509{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v9"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v9");return true;
}
}
