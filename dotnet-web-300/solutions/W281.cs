// W281: Idempotency key POST contracts / scenario 1
// Key limit 8; replay 200, creation 201
// Read prompts/W281.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W281 {
public sealed record Saved(int Id,string Payload); public sealed class Store {public int NextId;public Dictionary<string,Saved> Records {get;}=new(StringComparer.Ordinal);}
 public static IResult Handle(HttpRequest request, string payload, Store store) {
  var keys=request.Headers["Idempotency-Key"];if(keys.Count!=1||string.IsNullOrWhiteSpace(keys[0])||keys[0]!.Length>8)return Results.BadRequest();var key=keys[0]!;if(store.Records.TryGetValue(key,out var saved))return saved.Payload==payload?Results.Ok(new {id=saved.Id,payload=saved.Payload}):Results.Conflict(new {error="key-reused"});var entry=new Saved(++store.NextId,payload);store.Records[key]=entry;return Results.Created("/submissions/"+entry.Id,new {id=entry.Id,payload});
 }
}
