// W191: Streaming text response writers / scenario 1
// NDJSON integer stream; max 1 records
// Read prompts/W191.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W191 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W191");
 }
}
