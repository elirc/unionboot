// W136: Dependency injection lifetime registration / scenario 6
// RequestStamp Singleton; scenario 6
// Read prompts/W136.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W136 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W136");
 }
}
