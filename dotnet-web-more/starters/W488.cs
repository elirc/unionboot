// W488: Exception handler status mapping / NotSupportedException mapped to 501
namespace DotnetWeb;
public static class W488{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W488.Handle(c,e,t);}
public static ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){throw new NotImplementedException("W488");}
}
