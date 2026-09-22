// W029: Conditional deletion contracts / scenario 9
// Missing is idempotent 204; protected id 10
// Read prompts/W029.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W029 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W029");
 }
}
