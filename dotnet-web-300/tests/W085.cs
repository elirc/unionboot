using static DotnetWeb.W085;
namespace DotnetWeb;
public static class TestsW085 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.Headers["x-api-version"]="5";var r=await Check.Execute(Handle(c.Request));Check.Json(r,"version",5);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context().Request))).Response.StatusCode);
 }
 {
 var c2=Check.Context();c2.Request.Headers["X-Api-Version"]=new StringValues(new[]{"5","5"});Check.Status(400,Handle(c2.Request));var c3=Check.Context();c3.Request.Headers["X-Api-Version"]="05";Check.Status(400,Handle(c3.Request));var c4=Check.Context();c4.Request.Headers["X-Api-Version"]="";Check.Status(400,Handle(c4.Request));
 }
} }
