// W041: Pagination query handlers / scenario 1
// Default size 2, max 10; strict single-value query
// Read prompts/W041.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W041 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W041");
 }
}
