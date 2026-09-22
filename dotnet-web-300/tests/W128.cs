using static DotnetWeb.W128;
namespace DotnetWeb;
public static class TestsW128 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.RouteValues["listId"]="007";var r=await Check.Execute(Handle(c));Check.Json(r,"id",7);c.Request.RouteValues["listId"]="2147483647";Check.Status(200,Handle(c));c.Request.RouteValues["listId"]="2147483648";Check.Status(400,Handle(c));c.Request.RouteValues["listId"]=7;Check.Status(400,Handle(c));c.Request.RouteValues["listId"]="0";Check.Status(400,Handle(c));
 }
 {
 Check.Status(400, Handle(Check.Context()));
 }
} }
