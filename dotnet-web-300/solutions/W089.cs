// W089: Header based request versioning / scenario 9
// X-Api-Version 9; missing accepted as current
// Read prompts/W089.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W089 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=9});if(values.Count!=1||values[0]!="9")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=9});
 }
}
