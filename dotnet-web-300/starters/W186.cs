// W186: Request cancellation propagation / scenario 6
// Injected inventory lookup; amount factor 6
// Read prompts/W186.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W186 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W186");
 }
}
