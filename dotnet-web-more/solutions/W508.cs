// W508: WebSocket handshake stub features / Accept WebSocket subprotocol chat.v8
namespace DotnetWeb;
public static class W508{

public static async Task<bool> Accept(HttpContext context){
if(!context.WebSockets.IsWebSocketRequest||!context.WebSockets.WebSocketRequestedProtocols.Contains("chat.v8"))return false;using var socket=await context.WebSockets.AcceptWebSocketAsync("chat.v8");return true;
}
}
