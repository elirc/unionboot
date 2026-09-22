using static DotnetWeb.W124;
namespace DotnetWeb;
public static class TestsW124 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.RouteValues["noteId"]="007";var r=await Check.Execute(Handle(c));Check.Json(r,"id",7);c.Request.RouteValues["noteId"]="2147483647";Check.Status(200,Handle(c));c.Request.RouteValues["noteId"]="2147483648";Check.Status(400,Handle(c));c.Request.RouteValues["noteId"]=7;Check.Status(400,Handle(c));c.Request.RouteValues["noteId"]="0";Check.Status(400,Handle(c));
 }
 {
 Check.Status(400, Handle(Check.Context()));
 }
} }
