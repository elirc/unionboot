using static DotnetWeb.W003;
namespace DotnetWeb;
public static class TestsW003 { public static async Task Run() {
 await Task.CompletedTask;
{
  var catalog=new Dictionary<int,string>{{3,"Tea"}}; var c=await Check.Execute(Handle(3,catalog)); Check.Equal(200,c.Response.StatusCode); Check.Json(c,"id",3); Check.Json(c,"name","Tea"); Check.Equal(1,catalog.Count);
 }
 {
 Check.Equal(404, (await Check.Execute(Handle(4,new Dictionary<int,string>()))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(0,new Dictionary<int,string>()))).Response.StatusCode);
 }
 {
 Check.Equal(400, (await Check.Execute(Handle(-1,new Dictionary<int,string>()))).Response.StatusCode);
 }
} }
