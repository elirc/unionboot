// W182: Request cancellation propagation / scenario 2
// Injected inventory lookup; amount factor 2
// Read prompts/W182.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W182 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W182");
 }
}
