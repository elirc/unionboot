// W192: Streaming text response writers / scenario 2
// NDJSON integer stream; max 2 records
// Read prompts/W192.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W192 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W192");
 }
}
