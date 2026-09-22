// W086: Header based request versioning / scenario 6
// X-Api-Version 6; missing accepted as current
// Read prompts/W086.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W086 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=6});if(values.Count!=1||values[0]!="6")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=6});
 }
}
