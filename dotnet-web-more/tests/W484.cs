using static DotnetWeb.W484;
namespace DotnetWeb;
public static class TestsW484{public static async Task Run(){await Task.CompletedTask;
{
var c=Check.Context();IExceptionHandler handler=new Handler();Check.True(await handler.TryHandleAsync(c,new InvalidOperationException("private detail"),default));Check.Equal(409,c.Response.StatusCode);Check.Json(c,"status",409);Check.True(!Check.Body(c).Contains("private detail"));
}
{
var c=Check.Context();Check.True(!await new Handler().TryHandleAsync(c,new Exception("unknown"),default));Check.Equal(200,c.Response.StatusCode);Check.Equal("",Check.Body(c));
}
}}
