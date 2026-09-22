// W002: Resource lookup HTTP results / scenario 2
// Catalog 2; positive IDs; missing returns 404
// Read prompts/W002.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W002 {

 public static IResult Handle(int id, IReadOnlyDictionary<int,string> catalog) {
  if(id <= 0) return Results.BadRequest(new { error="invalid-id" }); return catalog.TryGetValue(id,out var name) ? Results.Ok(new { id, name }) : Results.NotFound();
 }
}
