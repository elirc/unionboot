// W261: Cache policy response middleware / scenario 1
// Public max-age 15; authenticated no-store
// Read prompts/W261.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W261 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W261");
 }
}
