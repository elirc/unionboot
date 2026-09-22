// W084: Header based request versioning / scenario 4
// X-Api-Version 4; missing accepted as current
// Read prompts/W084.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W084 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W084");
 }
}
