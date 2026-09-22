// W172: Domain error boundary middleware / scenario 2
// DomainFault maps 401; other errors propagate
// Read prompts/W172.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W172 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W172");
 }
}
