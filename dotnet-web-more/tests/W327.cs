using static DotnetWeb.W327;
namespace DotnetWeb;
public static class TestsW327{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(new RenderResult("a\"b"));Check.Equal(410,c.Response.StatusCode);Check.Equal("application/json; charset=utf-8",c.Response.ContentType);Check.Equal("render-410",c.Response.Headers["X-Result"].ToString());Check.Json(c,"payload","a\"b");
}
{
var c=await Check.Execute(new RenderResult(""));Check.Json(c,"payload","");Check.Equal(410,c.Response.StatusCode);
}
}}
