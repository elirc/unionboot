// W090: Header based request versioning / scenario 10
// X-Api-Version 10; missing accepted as current
// Read prompts/W090.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W090 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers["X-Api-Version"];if(values.Count==0)return Results.Ok(new {version=10});if(values.Count!=1||values[0]!="10")return Results.BadRequest(new {error="unsupported-version"});return Results.Ok(new {version=10});
 }
}
