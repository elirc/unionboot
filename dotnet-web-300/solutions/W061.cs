// W061: Strict boolean request query / scenario 1
// enabled; default true
// Read prompts/W061.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W061 {

 public static IResult Handle(HttpRequest request) {
  if(!request.Query.TryGetValue("enabled",out var values))return Results.Ok(new { value=true });if(values.Count!=1||!bool.TryParse(values[0],out var value))return Results.BadRequest(new { error="invalid-boolean" });return Results.Ok(new {value});
 }
}
