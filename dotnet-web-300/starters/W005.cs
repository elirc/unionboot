// W005: Resource lookup HTTP results / scenario 5
// Catalog 5; positive IDs; missing returns 404
// Read prompts/W005.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W005 {

 public static IResult Handle(int id, IReadOnlyDictionary<int,string> catalog) {
  // TODO: implement independently. References are excluded from practice builds.
  throw new NotImplementedException("W005");
 }
}
