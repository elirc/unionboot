// W180: Domain error boundary middleware / scenario 10
// DomainFault maps 409; other errors propagate
// Read prompts/W180.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W180 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W180");
 }
}
