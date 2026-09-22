using static DotnetWeb.W020;
namespace DotnetWeb;
public static class TestsW020 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=await Check.Execute(Handle(" Tea ",7));Check.Equal(201,c.Response.StatusCode);Check.Equal("/lists/7",c.Response.Headers.Location.ToString());Check.Json(c,"title","Tea");Check.Json(c,"id",7);
 }
 {
 Check.Equal(201, (await Check.Execute(Handle(new string('a',21),1))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(new string('a',22),1))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(" ",1))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(null,1))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle("ok",0))).Response.StatusCode);
 }
} }
