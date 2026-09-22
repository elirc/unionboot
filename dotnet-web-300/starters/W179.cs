// W179: Domain error boundary middleware / scenario 9
// DomainFault maps 408; other errors propagate
// Read prompts/W179.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W179 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W179");
 }
}
