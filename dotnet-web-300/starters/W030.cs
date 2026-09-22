// W030: Conditional deletion contracts / scenario 10
// Missing returns 404; protected id 11
// Read prompts/W030.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W030 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W030");
 }
}
