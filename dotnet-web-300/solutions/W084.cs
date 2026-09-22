// W084: Header based request versioning / scenario 4
// X-Api-Version 4; missing accepted as current
// Read prompts/W084.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W084 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=4});if(values.Count!=1||values[0]!="4")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=4});
 }
}
