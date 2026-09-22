// W082: Header based request versioning / scenario 2
// X-Api-Version 2; missing accepted as current
// Read prompts/W082.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W082 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=2});if(values.Count!=1||values[0]!="2")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=2});
 }
}
