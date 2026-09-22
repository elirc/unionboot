// W024: Conditional deletion contracts / scenario 4
// Missing returns 404; protected id 5
// Read prompts/W024.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W024 {

 public static IResult Handle(int id, IDictionary<int,string> store) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W024");
 }
}
