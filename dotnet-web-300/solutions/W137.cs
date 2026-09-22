// W137: Dependency injection lifetime registration / scenario 7
// RequestStamp Scoped; scenario 7
// Read prompts/W137.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W137 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  services.AddScoped<Stamp>();
 }
}
