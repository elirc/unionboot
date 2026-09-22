// W189: Request cancellation propagation / scenario 9
// Injected inventory lookup; amount factor 9
// Read prompts/W189.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W189 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W189");
 }
}
