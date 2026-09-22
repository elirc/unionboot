// W021: Conditional deletion contracts / scenario 1
// Missing is idempotent 204; protected id 2
// Read prompts/W021.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W021 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==2&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NoContent();
 }
}
