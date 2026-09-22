// W326: Custom IResult implementations / JSON result executor status 409
namespace DotnetWeb;
public static class W326{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W326.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=409;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-409";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
