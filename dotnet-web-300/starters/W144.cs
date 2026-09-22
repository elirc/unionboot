// W144: Keyed dependency injection / scenario 4
// Key 'print'; fallback key 'default'
// Read prompts/W144.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W144 {
public interface IChannel { string Name {get;} } public sealed class NamedChannel:IChannel {public string Name=>"print";} public sealed class DefaultChannel:IChannel {public string Name=>"default";}
 public static void Configure(IServiceCollection services) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W144");
 }
}
