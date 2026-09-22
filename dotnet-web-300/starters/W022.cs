// W022: Conditional deletion contracts / scenario 2
// Missing returns 404; protected id 3
// Read prompts/W022.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W022 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W022");
 }
}
