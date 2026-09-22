using static DotnetWeb.W396;
namespace DotnetWeb;
public static class TestsW396{public static async Task Run(){await Task.CompletedTask;
{
var source=Enumerable.Range(10,13).ToList();var first=await Check.Execute(Page(source,null));Check.Json(first,"page",source.Take(6).ToArray());Check.Json(first,"next",Convert.ToBase64String(Encoding.UTF8.GetBytes("v1:6")));var second=await Check.Execute(Page(source,Convert.ToBase64String(Encoding.UTF8.GetBytes("v1:6"))));Check.Json(second,"page",source.Skip(6).Take(6).ToArray());
}
{
var source=Enumerable.Range(1,6).ToList();var last=await Check.Execute(Page(source,null));using var doc=JsonDocument.Parse(Check.Body(last));Check.True(!doc.RootElement.TryGetProperty("next",out var n)||n.ValueKind==JsonValueKind.Null);Check.Status(400,Page(source,"!!!"));Check.Status(400,Page(source,Convert.ToBase64String(Encoding.UTF8.GetBytes("v2:0"))));Check.Status(400,Page(source,Convert.ToBase64String(Encoding.UTF8.GetBytes("v1:-2"))));
}
}}
