// W053: Filter and sort endpoint projections / scenario 3
// Ascending ordinal labels; cap 4
// Read prompts/W053.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W053 {
public sealed record Item(int Id,string Name,bool Active);
 public static IResult Handle(HttpRequest request, IReadOnlyList<Item> rows) {
  if(request.Query.TryGetValue("q",out var values)&&values.Count!=1)return Results.BadRequest();var term=request.Query["q"].ToString().Trim();var selected=rows.Where(r=>r.Active&&r.Name.Contains(term,StringComparison.OrdinalIgnoreCase)).OrderBy(r=>r.Name,StringComparer.Ordinal).ThenBy(r=>r.Id).Take(4).Select(r=>new {r.Id,r.Name}).ToArray();return Results.Ok(selected);
 }
}
