// W152: Options configuration and validation / scenario 2
// PageOptions limit 2..12
// Read prompts/W152.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W152 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W152");
 }
}
