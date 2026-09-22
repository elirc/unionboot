using static DotnetWeb.W025;
namespace DotnetWeb;
public static class TestsW025 { public static async Task Run() {
 await Task.CompletedTask;
{
  var store=new Dictionary<int,string>{{99,"x"},{6,"keep"}};var c=await Check.Execute(Handle(99,store));Check.Equal(204,c.Response.StatusCode);Check.Equal("",Check.Body(c));Check.True(!store.ContainsKey(99));Check.Status(409,Handle(6,store));Check.True(store.ContainsKey(6));
 }
 {
 Check.Status(204, Handle(99,new Dictionary<int,string>()));
 }
 {
 Check.Status(400, Handle(0,new Dictionary<int,string>()));
 }
} }
