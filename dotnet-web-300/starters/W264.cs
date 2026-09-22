// W264: Cache policy response middleware / scenario 4
// Public max-age 60; authenticated no-store
// Read prompts/W264.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W264 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W264");
 }
}
