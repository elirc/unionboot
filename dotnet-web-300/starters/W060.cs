// W060: Filter and sort endpoint projections / scenario 10
// Descending ordinal labels; cap 11
// Read prompts/W060.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W060 {
public sealed record Item(int Id,string Name,bool Active);
 public static IResult Handle(HttpRequest request, IReadOnlyList<Item> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W060");
 }
}
