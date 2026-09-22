// W189: Request cancellation propagation / scenario 9
// Injected inventory lookup; amount factor 9
// Read prompts/W189.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W189 {

 public static async Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  context.RequestAborted.ThrowIfCancellationRequested();var value=await lookup(context.RequestAborted);context.RequestAborted.ThrowIfCancellationRequested();return Results.Ok(new { amount=(long)value*9 });
 }
}
