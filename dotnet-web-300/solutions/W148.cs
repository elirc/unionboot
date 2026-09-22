// W148: Keyed dependency injection / scenario 8
// Key 'mobile'; fallback key 'default'
// Read prompts/W148.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W148 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"mobile";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  services.AddKeyedSingleton<IChannel,NamedChannel>("mobile");services.AddKeyedSingleton<IChannel,DefaultChannel>("default");
 }
}
