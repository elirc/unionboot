// W262: Cache policy response middleware / scenario 2
// Public max-age 30; authenticated no-store
// Read prompts/W262.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W262 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W262");
 }
}
