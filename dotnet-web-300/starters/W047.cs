// W047: Pagination query handlers / scenario 7
// Default size 8, max 16; strict single-value query
// Read prompts/W047.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W047 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W047");
 }
}
