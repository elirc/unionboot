// W160: Options configuration and validation / scenario 10
// PageOptions limit 10..20
// Read prompts/W160.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W160 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  services.AddOptions<PageOptions>().Configure(o=>o.Limit=limit).Validate(o=>o.Limit>=10&&o.Limit<=20,"limit-range");
 }
}
