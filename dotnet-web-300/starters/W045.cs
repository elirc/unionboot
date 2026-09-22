// W045: Pagination query handlers / scenario 5
// Default size 6, max 14; strict single-value query
// Read prompts/W045.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W045 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W045");
 }
}
