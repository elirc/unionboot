// W323: Custom IResult implementations / JSON result executor status 202
namespace DotnetWeb;
public static class W323{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W323.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=202;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-202";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
