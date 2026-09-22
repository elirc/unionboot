// W003: Resource lookup HTTP results / scenario 3
// Catalog 3; positive IDs; missing returns 404
// Read prompts/W003.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W003 {

 public static IResult Handle(int id, IReadOnlyDictionary<int,string> catalog) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W003");
 }
}
