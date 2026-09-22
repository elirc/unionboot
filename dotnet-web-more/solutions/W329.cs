// W329: Custom IResult implementations / JSON result executor status 429
namespace DotnetWeb;
public static class W329{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W329.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=429;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-429";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
