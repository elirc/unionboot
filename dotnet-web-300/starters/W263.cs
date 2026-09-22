// W263: Cache policy response middleware / scenario 3
// Public max-age 45; authenticated no-store
// Read prompts/W263.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W263 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W263");
 }
}
