using static DotnetWeb.W091;
namespace DotnetWeb;
public static class TestsW091 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.ContentType="application/json; charset=utf-8";c.Request.ContentLength=64;Check.Status(202,Handle(c.Request));c.Request.ContentLength=65;Check.Status(413,Handle(c.Request));c.Request.ContentType="text/plain";Check.Status(415,Handle(c.Request));
 }
 {
 var c2=Check.Context();c2.Request.ContentType="application/vnd.example+json";Check.Status(202,Handle(c2.Request));
 }
 {
 Check.Status(415, Handle(Check.Context().Request));
 }
} }
