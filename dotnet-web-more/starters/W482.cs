// W482: Exception handler status mapping / KeyNotFoundException mapped to 404
namespace DotnetWeb;
public static class W482{
public sealed class Handler:IExceptionHandler{public ValueTask<bool> TryHandleAsync(HttpContext c,Exception e,CancellationToken t)=>W482.Handle(c,e,t);}
public static ValueTask<bool> Handle(HttpContext context,Exception exception,CancellationToken token){throw new NotImplementedException("W482");}
}
