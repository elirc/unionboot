// W481: Exception handler status mapping / ArgumentException mapped to 400
namespace DotnetWeb;
public static class W481{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W481.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not ArgumentException)return false;context.Response.StatusCode=400;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=400,title="ArgumentException rejected"}),token);return true;
}
}
