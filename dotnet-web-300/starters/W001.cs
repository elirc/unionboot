// W001: Resource lookup HTTP results / scenario 1
// Catalog 1; positive IDs; missing returns 404
// Read prompts/W001.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W001 {

 public static IResult Handle(int id, IReadOnlyDictionary<int,string> catalog) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W001");
 }
}
