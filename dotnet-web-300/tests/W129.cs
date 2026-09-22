using static DotnetWeb.W129;
namespace DotnetWeb;
public static class TestsW129 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.RouteValues["itemId"]="007";var r=await Check.Execute(Handle(c));Check.Json(r,"id",7);c.Request.RouteValues["itemId"]="2147483647";Check.Status(200,Handle(c));c.Request.RouteValues["itemId"]="2147483648";Check.Status(400,Handle(c));c.Request.RouteValues["itemId"]=7;Check.Status(400,Handle(c));c.Request.RouteValues["itemId"]="0";Check.Status(400,Handle(c));
 }
 {
 Check.Status(400, Handle(Check.Context()));
 }
} }
