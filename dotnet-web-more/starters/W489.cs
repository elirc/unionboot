// W489: Exception handler status mapping / IOException mapped to 503
namespace DotnetWeb;
public static class W489{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W489.Handle(c,e,t);}
public static ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){throw new NotImplementedException("W489");}
}
