// W101: JSON request body validation / scenario 1
// Body {count}; integer range 0..3
// Read prompts/W101.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W101 {

 public static Task<IResult> Handle(HttpRequest request) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W101");
 }
}
