// W090: Header based request versioning / scenario 10
// X-Api-Version 10; missing accepted as current
// Read prompts/W090.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W090 {

 public static IResult Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W090");
 }
}
