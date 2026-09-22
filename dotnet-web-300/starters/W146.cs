// W146: Keyed dependency injection / scenario 6
// Key 'web'; fallback key 'default'
// Read prompts/W146.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W146 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"web";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W146");
 }
}
