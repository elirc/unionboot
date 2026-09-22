// W030: Conditional deletion contracts / scenario 10
// Missing returns 404; protected id 11
// Read prompts/W030.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W030 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  if(id<=0)return Results.BadRequest();if(id==11&&store.ContainsKey(id))return Results.Conflict(new { error="protected" });return store.Remove(id)?Results.NoContent():Results.NotFound();
 }
}
