// W486: Exception handler status mapping / OperationCanceledException mapped to 499
namespace DotnetWeb;
public static class W486{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W486.Handle(c,e,t);}
public static ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){throw new NotImplementedException("W486");}
}
