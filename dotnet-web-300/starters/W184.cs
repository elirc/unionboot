// W184: Request cancellation propagation / scenario 4
// Injected inventory lookup; amount factor 4
// Read prompts/W184.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W184 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W184");
 }
}
