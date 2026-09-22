// W143: Keyed dependency injection / scenario 3
// Key 'push'; fallback key 'default'
// Read prompts/W143.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W143 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"push";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W143");
 }
}
