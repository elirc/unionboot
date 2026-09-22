// W157: Options configuration and validation / scenario 7
// PageOptions limit 7..17
// Read prompts/W157.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W157 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W157");
 }
}
