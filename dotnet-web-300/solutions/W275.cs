// W275: Injected deterministic cache handlers / scenario 5
// Injected clock; TTL 5 seconds; exact expiry is stale
// Read prompts/W275.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W275 {
public sealed record Entry(string Value,DateTimeOffset Expires); public sealed class Cache { public Dictionary<string,Entry> Values {get;}=new(StringComparer.Ordinal); }
 public static IResult Handle(string key, Cache store, TimeProvider clock, Func<string> load) {
  if(string.IsNullOrWhiteSpace(key))return Results.BadRequest();var now=clock.GetUtcNow();if(store.Values.TryGetValue(key,out var hit)&&now<hit.Expires)return Results.Ok(new {value=hit.Value,cached=true});var value=load();store.Values[key]=new Entry(value,now.AddSeconds(5));return Results.Ok(new {value,cached=false});
 }
}
