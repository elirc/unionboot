// W134: Dependency injection lifetime registration / scenario 4
// RequestStamp Scoped; scenario 4
// Read prompts/W134.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W134 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  services.AddScoped<Stamp>();
 }
}
