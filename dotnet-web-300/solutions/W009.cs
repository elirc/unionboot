// W009: Resource lookup HTTP results / scenario 9
// Catalog 9; positive IDs; missing returns 404
// Read prompts/W009.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W009 {

 public static IResult Handle(int id, IReadOnlyDictionary<int,string> catalog) {
  if(id <= 0) return Results.BadRequest(new { error="invalid-id" }); return catalog.TryGetValue(id,out var name) ? Results.Ok(new { id, name }) : Results.NotFound();
 }
}
