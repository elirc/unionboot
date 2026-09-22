// W193: Streaming text response writers / scenario 3
// NDJSON integer stream; max 3 records
// Read prompts/W193.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W193 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W193");
 }
}
