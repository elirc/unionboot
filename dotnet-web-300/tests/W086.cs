using static DotnetWeb.W086;
namespace DotnetWeb;
public static class TestsW086 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();c.Request.Headers["x-api-version"]="6";var r=await Check.Execute(Handle(c.Request));Check.Json(r,"version",6);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context().Request))).Response.StatusCode);
 }
 {
 var c2=Check.Context();c2.Request.Headers["X-Api-Version"]=new StringValues(new[]{"6","6"});Check.Status(400,Handle(c2.Request));var c3=Check.Context();c3.Request.Headers["X-Api-Version"]="06";Check.Status(400,Handle(c3.Request));var c4=Check.Context();c4.Request.Headers["X-Api-Version"]="";Check.Status(400,Handle(c4.Request));
 }
} }
