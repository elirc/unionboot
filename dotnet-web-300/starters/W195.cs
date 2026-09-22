// W195: Streaming text response writers / scenario 5
// NDJSON integer stream; max 5 records
// Read prompts/W195.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W195 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W195");
 }
}
