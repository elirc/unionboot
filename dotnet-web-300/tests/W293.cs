using static DotnetWeb.W293;
namespace DotnetWeb;
public static class TestsW293 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle("café"));Check.Equal(200,c.Response.StatusCode);Check.Equal("café",Check.Body(c));Check.Equal((long?)5,c.Response.ContentLength);Check.Equal("text/plain; charset=utf-8",c.Response.ContentType);Check.True(c.Response.Headers.ContentDisposition.ToString().Contains("report-3.txt"));Check.True(c.Response.Headers.ContentDisposition.ToString().StartsWith("attachment;"));
 }
 {
 var empty=await Check.Execute(Handle(""));Check.Equal(200,empty.Response.StatusCode);Check.Equal("",Check.Body(empty));Check.Equal((long?)0,empty.Response.ContentLength);
 }
 {
 Check.Equal(404, (await Check.Execute(Handle(null))).Response.StatusCode);
 }
} }
