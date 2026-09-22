// W026: Conditional deletion contracts / scenario 6
// Missing returns 404; protected id 7
// Read prompts/W026.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W026 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W026");
 }
}
