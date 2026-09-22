// W025: Conditional deletion contracts / scenario 5
// Missing is idempotent 204; protected id 6
// Read prompts/W025.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W025 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==6&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NoContent();
 }
}
