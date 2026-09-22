// W089: Header based request versioning / scenario 9
// X-Api-Version 9; missing accepted as current
// Read prompts/W089.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W089 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W089");
 }
}
