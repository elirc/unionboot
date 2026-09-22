// W028: Conditional deletion contracts / scenario 8
// Missing returns 404; protected id 9
// Read prompts/W028.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W028 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==9&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NotFound();
 }
}
