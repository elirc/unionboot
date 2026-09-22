// W171: Domain error boundary middleware / scenario 1
// DomainFault maps 400; other errors propagate
// Read prompts/W171.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W171 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W171");
 }
}
