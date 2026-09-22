// W133: Dependency injection lifetime registration / scenario 3
// RequestStamp Singleton; scenario 3
// Read prompts/W133.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W133 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W133");
 }
}
