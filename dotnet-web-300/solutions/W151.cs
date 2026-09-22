// W151: Options configuration and validation / scenario 1
// PageOptions limit 1..11
// Read prompts/W151.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W151 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  services.AddOptions<PageOptions>().Configure(o=>o.Limit=limit).Validate(o=>o.Limit>=1&&o.Limit<=11,"limit-range");
 }
}
