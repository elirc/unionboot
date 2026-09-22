// W290: Idempotency key POST contracts / scenario 10
// Key limit 17; replay 200, creation 201
// Read prompts/W290.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W290 {
public sealed record Saved(int Id,string Payload); public sealed class Store {public int NextId;public Dictionary<string,Saved> Records {get;}=new(StringComparer.Ordinal);}
 public static IResult Handle(HttpRequest request, string payload, Store store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W290");
 }
}
