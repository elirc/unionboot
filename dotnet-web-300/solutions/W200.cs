// W200: Streaming text response writers / scenario 10
// NDJSON integer stream; max 10 records
// Read prompts/W200.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W200 {

 public static async Task Handle(HttpContext context, IAsyncEnumerable<int> source) {
  context.RequestAborted.ThrowIfCancellationRequested();context.Response.ContentType="application/x-ndjson; charset=utf-8";int count=0;await foreach(var n in source.WithCancellation(context.RequestAborted)){context.RequestAborted.ThrowIfCancellationRequested();await context.Response.WriteAsync(JsonSerializer.Serialize(new {value=n})+"\n",context.RequestAborted);if(++count==10)break;}
 }
}
