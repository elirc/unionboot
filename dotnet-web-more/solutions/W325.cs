// W325: Custom IResult implementations / JSON result executor status 404
namespace DotnetWeb;
public static class W325{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W325.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=404;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-404";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
