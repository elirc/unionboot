// W131: Dependency injection lifetime registration / scenario 1
// RequestStamp Scoped; scenario 1
// Read prompts/W131.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W131 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  services.AddScoped<Stamp>();
 }
}
