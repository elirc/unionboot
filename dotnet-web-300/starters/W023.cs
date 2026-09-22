// W023: Conditional deletion contracts / scenario 3
// Missing is idempotent 204; protected id 4
// Read prompts/W023.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W023 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W023");
 }
}
