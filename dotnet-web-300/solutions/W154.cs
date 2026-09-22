// W154: Options configuration and validation / scenario 4
// PageOptions limit 4..14
// Read prompts/W154.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W154 {
public sealed class PageOptions { public int Limit {get;set;} }
 public static void Configure(IServiceCollection services, int limit) {
  services.AddOptions<PageOptions>().Configure(o=>o.Limit=limit).Validate(o=>o.Limit>=4&&o.Limit<=14,"limit-range");
 }
}
