// W135: Dependency injection lifetime registration / scenario 5
// RequestStamp Transient; scenario 5
// Read prompts/W135.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W135 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W135");
 }
}
