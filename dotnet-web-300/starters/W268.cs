// W268: Cache policy response middleware / scenario 8
// Public max-age 120; authenticated no-store
// Read prompts/W268.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W268 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W268");
 }
}
