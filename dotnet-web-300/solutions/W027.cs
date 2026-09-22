// W027: Conditional deletion contracts / scenario 7
// Missing is idempotent 204; protected id 8
// Read prompts/W027.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W027 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==8&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NoContent();
 }
}
