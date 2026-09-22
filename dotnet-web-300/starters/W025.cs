// W025: Conditional deletion contracts / scenario 5
// Missing is idempotent 204; protected id 6
// Read prompts/W025.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W025 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W025");
 }
}
