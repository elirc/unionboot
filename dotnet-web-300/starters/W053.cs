// W053: Filter and sort endpoint projections / scenario 3
// Ascending ordinal labels; cap 4
// Read prompts/W053.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W053 {
public sealed record Item(int Id,string Name,bool Active);
 public static IResult Handle(HttpRequest request, IReadOnlyList<Item> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W053");
 }
}
