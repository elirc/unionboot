// W269: Cache policy response middleware / scenario 9
// Public max-age 135; authenticated no-store
// Read prompts/W269.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W269 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W269");
 }
}
