// W488: Exception handler status mapping / NotSupportedException mapped to 501
namespace DotnetWeb;
public static class W488{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W488.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not NotSupportedException)return false;context.Response.StatusCode=501;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=501,title="NotSupportedException rejected"}),token);return true;
}
}
