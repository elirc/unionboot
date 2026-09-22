// W188: Request cancellation propagation / scenario 8
// Injected inventory lookup; amount factor 8
// Read prompts/W188.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W188 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W188");
 }
}
