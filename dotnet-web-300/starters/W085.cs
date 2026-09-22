// W085: Header based request versioning / scenario 5
// X-Api-Version 5; missing accepted as current
// Read prompts/W085.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W085 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W085");
 }
}
