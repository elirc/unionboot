// W182: Request cancellation propagation / scenario 2
// Injected inventory lookup; amount factor 2
// Read prompts/W182.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W182 {

 public static async Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  context.RequestAborted.ThrowIfCancellationRequested();var value=await lookup(context.RequestAborted);context.RequestAborted.ThrowIfCancellationRequested();return Results.Ok(new { amount=(long)value*2 });
 }
}
