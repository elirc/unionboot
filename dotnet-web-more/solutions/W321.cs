// W321: Custom IResult implementations / JSON result executor status 200
namespace DotnetWeb;
public static class W321{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W321.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=200;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-200";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
