// W081: Header based request versioning / scenario 1
// X-Api-Version 1; missing accepted as current
// Read prompts/W081.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W081 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W081");
 }
}
