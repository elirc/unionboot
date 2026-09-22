// W052: Filter and sort endpoint projections / scenario 2
// Descending ordinal labels; cap 3
// Read prompts/W052.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W052 {
public sealed record Item(int Id,string Name,bool Active);
 public static IResult Handle(HttpRequest request, IReadOnlyList<Item> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W052");
 }
}
