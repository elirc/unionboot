using static DotnetWeb.W064;
namespace DotnetWeb;
public static class TestsW064 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(Check.Context("?compact=FALSE").Request));Check.Json(c,"value",false);var d=await Check.Execute(Handle(Check.Context("").Request));Check.Json(d,"value",false);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context("?compact=true").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?compact=1").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?compact=").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?compact=true&compact=false").Request))).Response.StatusCode);
 }
} }
