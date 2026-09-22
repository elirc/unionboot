using static DotnetWeb.W260;
namespace DotnetWeb;
public static class TestsW260 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.Headers.IfNoneMatch="W/\"v10\"";await Handle(c).ExecuteAsync(c);Check.Equal(304,c.Response.StatusCode);Check.Equal("",Check.Body(c));Check.Equal("\"v10\"",c.Response.Headers.ETag.ToString());
 }
 {
 foreach(var value in new[]{"*","\"old\", \"v10\""}){var c=Check.Context();c.Request.Headers.IfNoneMatch=value;Check.Status(304,Handle(c));}var missing=Check.Context();await Handle(missing).ExecuteAsync(missing);Check.Equal(200,missing.Response.StatusCode);Check.Json(missing,"version",10);var bad=Check.Context();bad.Request.Headers.IfNoneMatch="v10";Check.Status(200,Handle(bad));
 }
} }
