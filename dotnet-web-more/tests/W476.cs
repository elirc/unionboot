using static DotnetWeb.W476;
namespace DotnetWeb;
public static class TestsW476{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Project(new Item(7,"Desk",12.5m,3),null));using var d=JsonDocument.Parse(Check.Body(c));Check.Equal(2,d.RootElement.EnumerateObject().Count());Check.True(d.RootElement.TryGetProperty("id",out _));Check.True(d.RootElement.TryGetProperty("price",out _));
}
{
var c=await Check.Execute(Project(new Item(7,"Desk",12.5m,3)," title ,id,title "));Check.Json(c,"title","Desk");Check.Json(c,"id",7);using var d=JsonDocument.Parse(Check.Body(c));Check.Equal(2,d.RootElement.EnumerateObject().Count());Check.Status(400,Project(new Item(1,"x",1,0),"secret"));Check.Equal("{}",Check.Body(await Check.Execute(Project(new Item(1,"x",1,0),""))));
}
}}
