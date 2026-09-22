// W088: Header based request versioning / scenario 8
// X-Api-Version 8; missing accepted as current
// Read prompts/W088.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W088 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=8});if(values.Count!=1||values[0]!="8")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=8});
 }
}
