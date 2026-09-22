using static DotnetWeb.W061;
namespace DotnetWeb;
public static class TestsW061 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(Check.Context("?enabled=FALSE").Request));Check.Json(c,"value",false);var d=await Check.Execute(Handle(Check.Context("").Request));Check.Json(d,"value",true);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context("?enabled=true").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?enabled=1").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?enabled=").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?enabled=true&enabled=false").Request))).Response.StatusCode);
 }
} }
