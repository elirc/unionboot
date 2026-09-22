using static DotnetWeb.W065;
namespace DotnetWeb;
public static class TestsW065 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(Check.Context("?details=FALSE").Request));Check.Json(c,"value",false);var d=await Check.Execute(Handle(Check.Context("").Request));Check.Json(d,"value",true);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context("?details=true").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?details=1").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?details=").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?details=true&details=false").Request))).Response.StatusCode);
 }
} }
