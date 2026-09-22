// W265: Cache policy response middleware / scenario 5
// Public max-age 75; authenticated no-store
// Read prompts/W265.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W265 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W265");
 }
}
