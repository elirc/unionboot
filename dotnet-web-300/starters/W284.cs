// W284: Idempotency key POST contracts / scenario 4
// Key limit 11; replay 200, creation 201
// Read prompts/W284.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W284 {
public sealed record Saved(int Id,string Payload); public sealed class Store {public int NextId;public Dictionary<string,Saved> Records {get;}=new(StringComparer.Ordinal);}
 public static IResult Handle(HttpRequest request, string payload, Store store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W284");
 }
}
