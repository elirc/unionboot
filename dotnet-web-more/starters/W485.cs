// W485: Exception handler status mapping / TimeoutException mapped to 504
namespace DotnetWeb;
public static class W485{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W485.Handle(c,e,t);}
public static ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){throw new NotImplementedException("W485");}
}
