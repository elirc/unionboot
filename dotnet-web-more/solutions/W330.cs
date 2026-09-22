// W330: Custom IResult implementations / JSON result executor status 503
namespace DotnetWeb;
public static class W330{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W330.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=503;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-503";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
