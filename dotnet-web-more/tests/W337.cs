using static DotnetWeb.W337;
namespace DotnetWeb;
public static class TestsW337{public static async Task Run(){await Task.CompletedTask;
{
var input=Check.Context();input.Request.Path="/orders/7";input.TraceIdentifier="trace-a";var c=await Check.Execute(Handle("reason",input));Check.Equal(415,c.Response.StatusCode);Check.True(c.Response.ContentType!.StartsWith("application/problem+json"));Check.Json(c,"title","Rejected 415");Check.Json(c,"detail","reason");Check.Json(c,"instance","/orders/7");Check.Json(c,"traceId","trace-a");
}
{
var c=await Check.Execute(Handle(null,Check.Context()));using var d=JsonDocument.Parse(Check.Body(c));Check.True(!d.RootElement.TryGetProperty("detail",out var detail)||detail.ValueKind==JsonValueKind.Null);Check.Json(c,"type","urn:problem:415");
}
}}
