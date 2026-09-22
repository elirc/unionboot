// W322: Custom IResult implementations / JSON result executor status 201
namespace DotnetWeb;
public static class W322{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W322.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=201;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-201";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
