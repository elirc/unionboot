// W004: Resource lookup HTTP results / scenario 4
// Catalog 4; positive IDs; missing returns 404
// Read prompts/W004.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W004 {

 public static IResult Handle(int id, IReadOnlyDictionary<int,string> catalog) {
  if(id <= 0) return Results.BadRequest(new { error="invalid-id" }); return catalog.TryGetValue(id,out var name) ? Results.Ok(new { id, name }) : Results.NotFound();
 }
}
