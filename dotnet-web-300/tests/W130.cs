using static DotnetWeb.W130;
namespace DotnetWeb;
public static class TestsW130 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.RouteValues["draftId"]="007";var r=await Check.Execute(Handle(c));Check.Json(r,"id",7);c.Request.RouteValues["draftId"]="2147483647";Check.Status(200,Handle(c));c.Request.RouteValues["draftId"]="2147483648";Check.Status(400,Handle(c));c.Request.RouteValues["draftId"]=7;Check.Status(400,Handle(c));c.Request.RouteValues["draftId"]="0";Check.Status(400,Handle(c));
 }
 {
 Check.Status(400, Handle(Check.Context()));
 }
} }
