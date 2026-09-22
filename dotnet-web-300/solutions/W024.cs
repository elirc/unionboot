// W024: Conditional deletion contracts / scenario 4
// Missing returns 404; protected id 5
// Read prompts/W024.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W024 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==5&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NotFound();
 }
}
