// W158: Options configuration and validation / scenario 8
// PageOptions limit 8..18
// Read prompts/W158.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W158 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W158");
 }
}
