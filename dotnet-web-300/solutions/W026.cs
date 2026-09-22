// W026: Conditional deletion contracts / scenario 6
// Missing returns 404; protected id 7
// Read prompts/W026.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W026 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==7&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NotFound();
 }
}
