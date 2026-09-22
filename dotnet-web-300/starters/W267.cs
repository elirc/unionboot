// W267: Cache policy response middleware / scenario 7
// Public max-age 105; authenticated no-store
// Read prompts/W267.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W267 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W267");
 }
}
