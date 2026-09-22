// W181: Request cancellation propagation / scenario 1
// Injected inventory lookup; amount factor 1
// Read prompts/W181.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W181 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W181");
 }
}
