// W482: Exception handler status mapping / KeyNotFoundException mapped to 404
namespace DotnetWeb;
public static class W482{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W482.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not KeyNotFoundException)return false;context.Response.StatusCode=404;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=404,title="KeyNotFoundException rejected"}),token);return true;
}
}
