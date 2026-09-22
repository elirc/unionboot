using static DotnetWeb.W063;
namespace DotnetWeb;
public static class TestsW063 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(Check.Context("?preview=FALSE").Request));Check.Json(c,"value",false);var d=await Check.Execute(Handle(Check.Context("").Request));Check.Json(d,"value",true);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context("?preview=true").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?preview=1").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?preview=").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?preview=true&preview=false").Request))).Response.StatusCode);
 }
} }
