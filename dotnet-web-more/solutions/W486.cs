// W486: Exception handler status mapping / OperationCanceledException mapped to 499
namespace DotnetWeb;
public static class W486{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W486.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not OperationCanceledException)return false;context.Response.StatusCode=499;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=499,title="OperationCanceledException rejected"}),token);return true;
}
}
