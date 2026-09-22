// W149: Keyed dependency injection / scenario 9
// Key 'audit'; fallback key 'default'
// Read prompts/W149.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W149 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"audit";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  services.AddKeyedSingleton<IChannel,NamedChannel>("audit");services.AddKeyedSingleton<IChannel,DefaultChannel>("default");
 }
}
