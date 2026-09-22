// W132: Dependency injection lifetime registration / scenario 2
// RequestStamp Transient; scenario 2
// Read prompts/W132.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W132 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W132");
 }
}
