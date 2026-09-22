// W057: Filter and sort endpoint projections / scenario 7
// Ascending ordinal labels; cap 8
// Read prompts/W057.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W057 {
public sealed record Item(int Id,string Name,bool Active);
 public static IResult Handle(HttpRequest request, IReadOnlyList<Item> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W057");
 }
}
