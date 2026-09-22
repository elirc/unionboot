// W176: Domain error boundary middleware / scenario 6
// DomainFault maps 405; other errors propagate
// Read prompts/W176.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W176 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W176");
 }
}
