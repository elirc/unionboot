// W197: Streaming text response writers / scenario 7
// NDJSON integer stream; max 7 records
// Read prompts/W197.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W197 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W197");
 }
}
