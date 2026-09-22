// W153: Options configuration and validation / scenario 3
// PageOptions limit 3..13
// Read prompts/W153.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W153 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  services.AddOptions<PageOptions>().Configure(o=>o.Limit=limit).Validate(o=>o.Limit>=3&&o.Limit<=13,"limit-range");
 }
}
