// W272: Injected deterministic cache handlers / scenario 2
// Injected clock; TTL 2 seconds; exact expiry is stale
// Read prompts/W272.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W272 {
public sealed record Entry(string Value,DateTimeOffset Expires); public sealed class Cache { public Dictionary<string,Entry> Values {get;}=new(StringComparer.Ordinal); }
 public static IResult Handle(string key, Cache store, TimeProvider clock, Func<string> load) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W272");
 }
}
