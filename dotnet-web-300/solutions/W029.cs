// W029: Conditional deletion contracts / scenario 9
// Missing is idempotent 204; protected id 10
// Read prompts/W029.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W029 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==10&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NoContent();
 }
}
