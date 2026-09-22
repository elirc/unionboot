using static DotnetWeb.W400;
namespace DotnetWeb;
public static class TestsW400{public static async Task Run(){await Task.CompletedTask;
{
var source=Enumerable.Range(10,21).ToList();var first=await Check.Execute(Page(source,null));Check.Json(first,"page",source.Take(10).ToArray());Check.Json(first,"next",Convert.ToBase64String(Encoding.UTF8.GetBytes("v1:10")));var second=await Check.Execute(Page(source,Convert.ToBase64String(Encoding.UTF8.GetBytes("v1:10"))));Check.Json(second,"page",source.Skip(10).Take(10).ToArray());
}
{
var source=Enumerable.Range(1,10).ToList();var last=await Check.Execute(Page(source,null));using var doc=JsonDocument.Parse(Check.Body(last));Check.True(!doc.RootElement.TryGetProperty("next",out var n)||n.ValueKind==JsonValueKind.Null);Check.Status(400,Page(source,"!!!"));Check.Status(400,Page(source,Convert.ToBase64String(Encoding.UTF8.GetBytes("v2:0"))));Check.Status(400,Page(source,Convert.ToBase64String(Encoding.UTF8.GetBytes("v1:-2"))));
}
}}
