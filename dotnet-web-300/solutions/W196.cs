// W196: Streaming text response writers / scenario 6
// NDJSON integer stream; max 6 records
// Read prompts/W196.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W196 {

 public static async Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  context.RequestAborted.ThrowIfCancellationRequested();context.Response.ContentType="application/x-ndjson; charset=utf-8";int count=0;await foreach(var n in source.WithCancellation(context.RequestAborted)){context.RequestAborted.ThrowIfCancellationRequested();await context.Response.WriteAsync(JsonSerializer.Serialize(new {value=n})+"\n",context.RequestAborted);if(++count==6)break;}
 }
}
