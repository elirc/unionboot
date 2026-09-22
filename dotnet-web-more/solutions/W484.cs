// W484: Exception handler status mapping / InvalidOperationException mapped to 409
namespace DotnetWeb;
public static class W484{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W484.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not InvalidOperationException)return false;context.Response.StatusCode=409;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=409,title="InvalidOperationException rejected"}),token);return true;
}
}
