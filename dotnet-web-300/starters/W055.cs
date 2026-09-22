// W055: Filter and sort endpoint projections / scenario 5
// Ascending ordinal labels; cap 6
// Read prompts/W055.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W055 {
public sealed record Item(int Id,string Name,bool Active);
 public static IResult Handle(HttpRequest request, IReadOnlyList<Item> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W055");
 }
}
