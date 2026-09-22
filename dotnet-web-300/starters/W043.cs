// W043: Pagination query handlers / scenario 3
// Default size 4, max 12; strict single-value query
// Read prompts/W043.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W043 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W043");
 }
}
