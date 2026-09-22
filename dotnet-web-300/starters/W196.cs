// W196: Streaming text response writers / scenario 6
// NDJSON integer stream; max 6 records
// Read prompts/W196.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W196 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W196");
 }
}
