using static DotnetWeb.W077;
namespace DotnetWeb;
public static class TestsW077 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(Check.Context("?from=2024-02-29&to=2024-02-29").Request));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"days",1);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(Check.Context("?from=2024-01-01&to=2024-01-07").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?from=2024-01-01&to=2024-01-08").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?from=2023-02-29&to=2023-02-29").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("?from=2024-03-02&to=2024-03-01").Request))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(Check.Context("").Request))).Response.StatusCode);
 }
} }
