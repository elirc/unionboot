// W042: Pagination query handlers / scenario 2
// Default size 3, max 11; strict single-value query
// Read prompts/W042.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W042 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W042");
 }
}
