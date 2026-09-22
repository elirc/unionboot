using static DotnetWeb.W505;
namespace DotnetWeb;
public static class TestsW505{public static async Task Run(){await Task.CompletedTask;
{
var c=Check.Context();var feature=new SocketFeature(true);c.Features.Set<IHttpWebSocketFeature>(feature);c.Request.Headers["Sec-WebSocket-Protocol"]="other, chat.v5";Check.True(await Accept(c));Check.Equal(1,feature.Calls);Check.Equal("chat.v5",feature.Protocol);
}
{
var c=Check.Context();var feature=new SocketFeature(true);c.Features.Set<IHttpWebSocketFeature>(feature);c.Request.Headers["Sec-WebSocket-Protocol"]="other";Check.True(!await Accept(c));Check.Equal(0,feature.Calls);var non=new SocketFeature(false);c.Features.Set<IHttpWebSocketFeature>(non);c.Request.Headers["Sec-WebSocket-Protocol"]="chat.v5";Check.True(!await Accept(c));Check.Equal(0,non.Calls);
}
}}
