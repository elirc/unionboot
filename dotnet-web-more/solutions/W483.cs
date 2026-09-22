// W483: Exception handler status mapping / UnauthorizedAccessException mapped to 403
namespace DotnetWeb;
public static class W483{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W483.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not UnauthorizedAccessException)return false;context.Response.StatusCode=403;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=403,title="UnauthorizedAccessException rejected"}),token);return true;
}
}
