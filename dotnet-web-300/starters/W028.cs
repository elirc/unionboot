// W028: Conditional deletion contracts / scenario 8
// Missing returns 404; protected id 9
// Read prompts/W028.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W028 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W028");
 }
}
