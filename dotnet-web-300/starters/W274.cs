// W274: Injected deterministic cache handlers / scenario 4
// Injected clock; TTL 4 seconds; exact expiry is stale
// Read prompts/W274.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W274 {
public sealed record Entry(string Value,DateTimeOffset Expires); public sealed class Cache { public Dictionary<string,Entry> Values {get;}=new(StringComparer.Ordinal); }
 public static IResult Handle(string key, Cache store, TimeProvider clock, Func<string> load) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W274");
 }
}
