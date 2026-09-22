// W159: Options configuration and validation / scenario 9
// PageOptions limit 9..19
// Read prompts/W159.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W159 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  services.AddOptions<PageOptions>().Configure(o=>o.Limit=limit).Validate(o=>o.Limit>=9&&o.Limit<=19,"limit-range");
 }
}
