// W177: Domain error boundary middleware / scenario 7
// DomainFault maps 406; other errors propagate
// Read prompts/W177.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W177 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{try{await next(context);}catch(DomainFault) when(!context.Response.HasStarted){context.Response.Clear();await Results.Problem(statusCode:406,title:"Request rejected",detail:"domain-fault").ExecuteAsync(context);}};
 }
}
