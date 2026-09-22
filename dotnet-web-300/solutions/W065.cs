// W065: Strict boolean request query / scenario 5
// details; default true
// Read prompts/W065.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W065 {

 public static IResult Handle(HttpRequest request) {
  if(!request.Query.TryGetValue("details",out var values))return Results.Ok(new { value=true });if(values.Count!=1||!bool.TryParse(values[0],out var value))return Results.BadRequest(new { error="invalid-boolean" });return Results.Ok(new {value});
 }
}
