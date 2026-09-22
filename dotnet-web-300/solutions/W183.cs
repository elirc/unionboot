// W183: Request cancellation propagation / scenario 3
// Injected inventory lookup; amount factor 3
// Read prompts/W183.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W183 {

 public static async Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  context.RequestAborted.ThrowIfCancellationRequested();var value=await lookup(context.RequestAborted);context.RequestAborted.ThrowIfCancellationRequested();return Results.Ok(new { amount=(long)value*3 });
 }
}
