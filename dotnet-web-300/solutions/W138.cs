// W138: Dependency injection lifetime registration / scenario 8
// RequestStamp Transient; scenario 8
// Read prompts/W138.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W138 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  services.AddTransient<Stamp>();
 }
}
