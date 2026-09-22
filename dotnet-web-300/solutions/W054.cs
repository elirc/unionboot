// W054: Filter and sort endpoint projections / scenario 4
// Descending ordinal labels; cap 5
// Read prompts/W054.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W054 {
public sealed record Item(int Id,string Name,bool Active);
 public static IResult Handle(HttpRequest request, IReadOnlyList<Item> rows) {
  if(request.Query.TryGetValue("q",out var values)&&values.Count!=1)return Results.BadRequest();var term=request.Query["q"].ToString().Trim();var selected=rows.Where(r=>r.Active&&r.Name.Contains(term,StringComparison.OrdinalIgnoreCase)).OrderByDescending(r=>r.Name,StringComparer.Ordinal).ThenBy(r=>r.Id).Take(5).Select(r=>new {r.Id,r.Name}).ToArray();return Results.Ok(selected);
 }
}
