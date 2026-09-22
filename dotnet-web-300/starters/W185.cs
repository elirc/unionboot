// W185: Request cancellation propagation / scenario 5
// Injected inventory lookup; amount factor 5
// Read prompts/W185.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W185 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W185");
 }
}
