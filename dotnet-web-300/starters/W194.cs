// W194: Streaming text response writers / scenario 4
// NDJSON integer stream; max 4 records
// Read prompts/W194.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W194 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W194");
 }
}
