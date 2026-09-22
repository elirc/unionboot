using static DotnetWeb.W482;
namespace DotnetWeb;
public static class TestsW482{public static async Task Run(){await Task.CompletedTask;
{
var c=Check.Context();IExceptionHandler handler=new Handler();Check.True(await handler.TryHandleAsync(c,new KeyNotFoundException("private detail"),default));Check.Equal(404,c.Response.StatusCode);Check.Json(c,"status",404);Check.True(!Check.Body(c).Contains("private detail"));
}
{
var c=Check.Context();Check.True(!await new Handler().TryHandleAsync(c,new Exception("unknown"),default));Check.Equal(200,c.Response.StatusCode);Check.Equal("",Check.Body(c));
}
}}
