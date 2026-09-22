// W156: Options configuration and validation / scenario 6
// PageOptions limit 6..16
// Read prompts/W156.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W156 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W156");
 }
}
