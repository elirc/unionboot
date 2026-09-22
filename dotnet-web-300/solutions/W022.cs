// W022: Conditional deletion contracts / scenario 2
// Missing returns 404; protected id 3
// Read prompts/W022.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W022 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==3&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NotFound();
 }
}
