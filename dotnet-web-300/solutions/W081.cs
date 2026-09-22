// W081: Header based request versioning / scenario 1
// X-Api-Version 1; missing accepted as current
// Read prompts/W081.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W081 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=1});if(values.Count!=1||values[0]!="1")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=1});
 }
}
