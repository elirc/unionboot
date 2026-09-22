using static DotnetWeb.W241;
namespace DotnetWeb;
public static class TestsW241 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.Headers.Accept="text/plain";var r=await Check.Execute(Handle(c.Request));Check.Equal(200,r.Response.StatusCode);Check.Equal("ready-1",Check.Body(r));Check.True(r.Response.ContentType!.StartsWith("text/plain"));var json=await Check.Execute(Handle(Check.Context().Request));Check.Json(json,"state","ready-1");
 }
 {
 foreach(var value in new[]{"application/json","*/*"}){var c=Check.Context();c.Request.Headers.Accept=value;Check.Status(200,Handle(c.Request));}foreach(var value in new[]{"text/html","application/json;q=0.5","application/json,text/plain",""}){var c=Check.Context();c.Request.Headers.Accept=value;Check.Status(406,Handle(c.Request));}
 }
} }
