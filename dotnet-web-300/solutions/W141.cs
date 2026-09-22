// W141: Keyed dependency injection / scenario 1
// Key 'sms'; fallback key 'default'
// Read prompts/W141.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W141 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"sms";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  services.AddKeyedSingleton<IChannel,NamedChannel>("sms");services.AddKeyedSingleton<IChannel,DefaultChannel>("default");
 }
}
