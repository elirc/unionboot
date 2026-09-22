// W083: Header based request versioning / scenario 3
// X-Api-Version 3; missing accepted as current
// Read prompts/W083.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W083 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=3});if(values.Count!=1||values[0]!="3")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=3});
 }
}
