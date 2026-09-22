// W082: Header based request versioning / scenario 2
// X-Api-Version 2; missing accepted as current
// Read prompts/W082.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W082 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W082");
 }
}
