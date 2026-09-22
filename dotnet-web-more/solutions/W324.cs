// W324: Custom IResult implementations / JSON result executor status 400
namespace DotnetWeb;
public static class W324{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W324.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=400;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-400";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
