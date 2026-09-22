// W490: Exception handler status mapping / NotImplementedException mapped to 501
namespace DotnetWeb;
public static class W490{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W490.Handle(c,e,t);}
public static ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){throw new NotImplementedException("W490");}
}
