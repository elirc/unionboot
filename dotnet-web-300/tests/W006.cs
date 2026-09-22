using static DotnetWeb.W006;
namespace DotnetWeb;
public static class TestsW006 { public static async Task Run() {
 await Task.CompletedTask;
{
  var catalog=new Dictionary<int,string>{{6,"Tea"}}; var c=await Check.Execute(Handle(6,catalog)); Check.Equal(200,c.Response.StatusCode); Check.Json(c,"id",6); Check.Json(c,"name","Tea"); Check.Equal(1,catalog.Count);
 }
 {
 Check.Equal(404, (await Check.Execute(Handle(7,new Dictionary<int,string>()))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(0,new Dictionary<int,string>()))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(-1,new Dictionary<int,string>()))).Response.StatusCode);
 }
} }
