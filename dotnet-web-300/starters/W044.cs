// W044: Pagination query handlers / scenario 4
// Default size 5, max 13; strict single-value query
// Read prompts/W044.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W044 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W044");
 }
}
