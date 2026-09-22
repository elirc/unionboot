// W489: Exception handler status mapping / IOException mapped to 503
namespace DotnetWeb;
public static class W489{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W489.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not IOException)return false;context.Response.StatusCode=503;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=503,title="IOException rejected"}),token);return true;
}
}
