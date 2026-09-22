// W142: Keyed dependency injection / scenario 2
// Key 'email'; fallback key 'default'
// Read prompts/W142.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W142 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"email";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W142");
 }
}
