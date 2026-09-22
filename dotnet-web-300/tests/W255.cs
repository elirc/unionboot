using static DotnetWeb.W255;
namespace DotnetWeb;
public static class TestsW255 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.Headers.IfNoneMatch="W/\"v5\"";await Handle(c).ExecuteAsync(c);Check.Equal(304,c.Response.StatusCode);Check.Equal("",Check.Body(c));Check.Equal("\"v5\"",c.Response.Headers.ETag.ToString());
 }
 {
 foreach(var value in new[]{"*","\"old\", \"v5\""}){var c=Check.Context();c.Request.Headers.IfNoneMatch=value;Check.Status(304,Handle(c));}var missing=Check.Context();await Handle(missing).ExecuteAsync(missing);Check.Equal(200,missing.Response.StatusCode);Check.Json(missing,"version",5);var bad=Check.Context();bad.Request.Headers.IfNoneMatch="v5";Check.Status(200,Handle(bad));
 }
} }
