// W328: Custom IResult implementations / JSON result executor status 422
namespace DotnetWeb;
public static class W328{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W328.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=422;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-422";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
