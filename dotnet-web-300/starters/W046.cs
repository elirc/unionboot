// W046: Pagination query handlers / scenario 6
// Default size 7, max 15; strict single-value query
// Read prompts/W046.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W046 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W046");
 }
}
