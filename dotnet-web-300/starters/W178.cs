// W178: Domain error boundary middleware / scenario 8
// DomainFault maps 407; other errors propagate
// Read prompts/W178.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W178 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W178");
 }
}
