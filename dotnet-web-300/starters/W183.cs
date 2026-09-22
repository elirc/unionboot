// W183: Request cancellation propagation / scenario 3
// Injected inventory lookup; amount factor 3
// Read prompts/W183.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W183 {

 public static Task<IResult> Handle(HttpContext context, Func<CancellationToken,Task<int>> lookup) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W183");
 }
}
