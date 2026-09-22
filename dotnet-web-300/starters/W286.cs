// W286: Idempotency key POST contracts / scenario 6
// Key limit 13; replay 200, creation 201
// Read prompts/W286.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W286 {
public sealed record Saved(int Id,string Payload); public sealed class Store {public int NextId;public Dictionary<string,Saved> Records {get;}=new(StringComparer.Ordinal);}
 public static IResult Handle(HttpRequest request, string payload, Store store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W286");
 }
}
