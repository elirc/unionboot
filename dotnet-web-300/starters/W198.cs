// W198: Streaming text response writers / scenario 8
// NDJSON integer stream; max 8 records
// Read prompts/W198.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W198 {

 public static Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W198");
 }
}
