// W087: Header based request versioning / scenario 7
// X-Api-Version 7; missing accepted as current
// Read prompts/W087.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W087 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=7});if(values.Count!=1||values[0]!="7")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=7});
 }
}
