using static DotnetWeb.W483;
namespace DotnetWeb;
public static class TestsW483{public static async Task Run(){await Task.CompletedTask;
{
var c=Check.Context();IExceptionHandler handler=new Handler();Check.True(await handler.TryHandleAsync(c,new UnauthorizedAccessException("private detail"),default));Check.Equal(403,c.Response.StatusCode);Check.Json(c,"status",403);Check.True(!Check.Body(c).Contains("private detail"));
}
{
var c=Check.Context();Check.True(!await new Handler().TryHandleAsync(c,new Exception("unknown"),default));Check.Equal(200,c.Response.StatusCode);Check.Equal("",Check.Body(c));
}
}}
