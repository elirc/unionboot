// W484: Exception handler status mapping / InvalidOperationException mapped to 409
namespace DotnetWeb;
public static class W484{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W484.Handle(c,e,t);}
public static ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){throw new NotImplementedException("W484");}
}
