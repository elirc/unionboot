using static DotnetWeb.W081;
namespace DotnetWeb;
public static class TestsW081 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.Headers["x-api-version"]="1";var r=await Check.Execute(Handle(c.Request));Check.Json(r,"version",1);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context().Request))).Response.StatusCode);
 }
 {
 var c2=Check.Context();c2.Request.Headers["X-Api-Version"]=new StringValues(new[]{"1","1"});Check.Status(400,Handle(c2.Request));var c3=Check.Context();c3.Request.Headers["X-Api-Version"]="01";Check.Status(400,Handle(c3.Request));var c4=Check.Context();c4.Request.Headers["X-Api-Version"]="";Check.Status(400,Handle(c4.Request));
 }
} }
