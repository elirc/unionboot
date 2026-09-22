// W174: Domain error boundary middleware / scenario 4
// DomainFault maps 403; other errors propagate
// Read prompts/W174.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W174 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W174");
 }
}
