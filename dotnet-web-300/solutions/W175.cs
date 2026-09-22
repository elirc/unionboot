// W175: Domain error boundary middleware / scenario 5
// DomainFault maps 404; other errors propagate
// Read prompts/W175.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W175 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{try{await next(context);}catch(DomainFault) when(!context.Response.HasStarted){context.Response.Clear();await Results.Problem(statusCode:404,title:"Request rejected",detail:"domain-fault").ExecuteAsync(context);}};
 }
}
