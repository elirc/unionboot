using static DotnetWeb.W039;
namespace DotnetWeb;
public static class TestsW039 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(" ",0));Check.Equal(400,c.Response.StatusCode);Check.True(c.Response.ContentType!.StartsWith("application/problem+json"));using var doc=JsonDocument.Parse(Check.Body(c));var errors=doc.RootElement.GetProperty("errors");Check.Equal("required",errors.GetProperty("name")[0].GetString());Check.Equal("range",errors.GetProperty("quantity")[0].GetString());
 }
 {
 Check.Equal(200, (await Check.Execute(Handle(" x ",1))).Response.StatusCode);
 }
 {
 Check.Equal(200, (await Check.Execute(Handle("x",13))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle("x",14))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(null,1))).Response.StatusCode);
 }
} }
