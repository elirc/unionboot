// W270: Cache policy response middleware / scenario 10
// Public max-age 150; authenticated no-store
// Read prompts/W270.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W270 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W270");
 }
}
