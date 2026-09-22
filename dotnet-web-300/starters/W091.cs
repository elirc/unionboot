// W091: JSON media type gates / scenario 1
// JSON-only; declared body limit 64 bytes
// Read prompts/W091.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W091 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W091");
 }
}
