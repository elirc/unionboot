// W266: Cache policy response middleware / scenario 6
// Public max-age 90; authenticated no-store
// Read prompts/W266.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W266 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W266");
 }
}
