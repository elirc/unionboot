// W139: Dependency injection lifetime registration / scenario 9
// RequestStamp Singleton; scenario 9
// Read prompts/W139.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W139 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  services.AddSingleton<Stamp>();
 }
}
