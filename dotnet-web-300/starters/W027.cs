// W027: Conditional deletion contracts / scenario 7
// Missing is idempotent 204; protected id 8
// Read prompts/W027.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W027 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W027");
 }
}
