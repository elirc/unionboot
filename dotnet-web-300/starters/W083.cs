// W083: Header based request versioning / scenario 3
// X-Api-Version 3; missing accepted as current
// Read prompts/W083.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W083 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W083");
 }
}
