// W145: Keyed dependency injection / scenario 5
// Key 'chat'; fallback key 'default'
// Read prompts/W145.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W145 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"chat";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W145");
 }
}
