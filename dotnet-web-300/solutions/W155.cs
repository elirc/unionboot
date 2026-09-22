// W155: Options configuration and validation / scenario 5
// PageOptions limit 5..15
// Read prompts/W155.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W155 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  services.AddOptions<PageOptions>().Configure(o=>o.Limit=limit).Validate(o=>o.Limit>=5&&o.Limit<=15,"limit-range");
 }
}
