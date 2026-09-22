using static DotnetWeb.W258;
namespace DotnetWeb;
public static class TestsW258 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.Headers.IfNoneMatch="W/\"v8\"";await Handle(c).ExecuteAsync(c);Check.Equal(304,c.Response.StatusCode);Check.Equal("",Check.Body(c));Check.Equal("\"v8\"",c.Response.Headers.ETag.ToString());
 }
 {
 foreach(var value in new[]{"*","\"old\", \"v8\""}){var c=Check.Context();c.Request.Headers.IfNoneMatch=value;Check.Status(304,Handle(c));}var missing=Check.Context();await Handle(missing).ExecuteAsync(missing);Check.Equal(200,missing.Response.StatusCode);Check.Json(missing,"version",8);var bad=Check.Context();bad.Request.Headers.IfNoneMatch="v8";Check.Status(200,Handle(bad));
 }
} }
