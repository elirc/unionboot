// W088: Header based request versioning / scenario 8
// X-Api-Version 8; missing accepted as current
// Read prompts/W088.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W088 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W088");
 }
}
