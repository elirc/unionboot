// W140: Dependency injection lifetime registration / scenario 10
// RequestStamp Scoped; scenario 10
// Read prompts/W140.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W140 {
public sealed class Stamp { public Guid Id {get;}=Guid.NewGuid(); }
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W140");
 }
}
