using static DotnetWeb.W067;
namespace DotnetWeb;
public static class TestsW067 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(Check.Context("?includeClosed=FALSE").Request));Check.Json(c,"value",false);var d=await Check.Execute(Handle(Check.Context("").Request));Check.Json(d,"value",true);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context("?includeClosed=true").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?includeClosed=1").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?includeClosed=").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?includeClosed=true&includeClosed=false").Request))).Response.StatusCode);
 }
} }
