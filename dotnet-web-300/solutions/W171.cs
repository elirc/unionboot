// W171: Domain error boundary middleware / scenario 1
// DomainFault maps 400; other errors propagate
// Read prompts/W171.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W171 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{try{await next(context);}catch(DomainFault) when(!context.Response.HasStarted){context.Response.Clear();await Results.Problem(statusCode:400,title:"Request rejected",detail:"domain-fault").ExecuteAsync(context);}};
 }
}
