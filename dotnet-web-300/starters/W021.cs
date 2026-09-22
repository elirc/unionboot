// W021: Conditional deletion contracts / scenario 1
// Missing is idempotent 204; protected id 2
// Read prompts/W021.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W021 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W021");
 }
}
