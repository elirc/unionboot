// W200: Streaming text response writers / scenario 10
// NDJSON integer stream; max 10 records
// Read prompts/W200.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W200 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W200");
 }
}
