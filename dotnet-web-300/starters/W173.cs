// W173: Domain error boundary middleware / scenario 3
// DomainFault maps 402; other errors propagate
// Read prompts/W173.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W173 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W173");
 }
}
