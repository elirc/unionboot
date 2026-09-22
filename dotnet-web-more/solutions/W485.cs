// W485: Exception handler status mapping / TimeoutException mapped to 504
namespace DotnetWeb;
public static class W485{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W485.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not TimeoutException)return false;context.Response.StatusCode=504;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=504,title="TimeoutException rejected"}),token);return true;
}
}
