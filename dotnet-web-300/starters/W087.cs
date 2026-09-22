// W087: Header based request versioning / scenario 7
// X-Api-Version 7; missing accepted as current
// Read prompts/W087.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W087 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W087");
 }
}
