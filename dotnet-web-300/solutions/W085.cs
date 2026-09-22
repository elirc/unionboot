// W085: Header based request versioning / scenario 5
// X-Api-Version 5; missing accepted as current
// Read prompts/W085.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W085 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=5});if(values.Count!=1||values[0]!="5")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=5});
 }
}
