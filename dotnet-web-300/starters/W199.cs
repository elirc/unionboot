// W199: Streaming text response writers / scenario 9
// NDJSON integer stream; max 9 records
// Read prompts/W199.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W199 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W199");
 }
}
