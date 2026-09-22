// W190: Request cancellation propagation / scenario 10
// Injected inventory lookup; amount factor 10
// Read prompts/W190.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W190 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W190");
 }
}
