// W150: Keyed dependency injection / scenario 10
// Key 'internal'; fallback key 'default'
// Read prompts/W150.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W150 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"internal";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W150");
 }
}
