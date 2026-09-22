// W487: Exception handler status mapping / FormatException mapped to 400
namespace DotnetWeb;
public static class W487{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W487.Handle(c,e,t);}
public static async ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){
if(exception is not FormatException)return false;context.Response.StatusCode=400;context.Response.ContentType="application/problem+json";await context.Response.WriteAsync(JsonSerializer.Serialize(new {status=400,title="FormatException rejected"}),token);return true;
}
}
