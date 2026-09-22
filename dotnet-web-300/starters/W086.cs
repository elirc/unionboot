// W086: Header based request versioning / scenario 6
// X-Api-Version 6; missing accepted as current
// Read prompts/W086.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W086 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W086");
 }
}
