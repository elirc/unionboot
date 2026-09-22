// W175: Domain error boundary middleware / scenario 5
// DomainFault maps 404; other errors propagate
// Read prompts/W175.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W175 {
public sealed class DomainFault(string message):Exception(message);
 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W175");
 }
}
