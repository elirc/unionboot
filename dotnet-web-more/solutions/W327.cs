// W327: Custom IResult implementations / JSON result executor status 410
namespace DotnetWeb;
public static class W327{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W327.ExecuteAsync(context,payload);}
public static async Task ExecuteAsync(HttpContext context,string payload){
context.Response.StatusCode=410;context.Response.ContentType="application/json; charset=utf-8";context.Response.Headers["X-Result"]="render-410";await context.Response.WriteAsync(JsonSerializer.Serialize(new {payload}),context.RequestAborted);
}
}
