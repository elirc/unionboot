// W483: Exception handler status mapping / UnauthorizedAccessException mapped to 403
namespace DotnetWeb;
public static class W483{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W483.Handle(c,e,t);}
public static ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){throw new NotImplementedException("W483");}
}
