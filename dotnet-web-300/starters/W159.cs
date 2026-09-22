// W159: Options configuration and validation / scenario 9
// PageOptions limit 9..19
// Read prompts/W159.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W159 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W159");
 }
}
