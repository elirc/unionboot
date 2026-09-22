// W147: Keyed dependency injection / scenario 7
// Key 'batch'; fallback key 'default'
// Read prompts/W147.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W147 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"batch";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  services.AddKeyedSingleton<IChannel,NamedChannel>("batch");services.AddKeyedSingleton<IChannel,DefaultChannel>("default");
 }
}
