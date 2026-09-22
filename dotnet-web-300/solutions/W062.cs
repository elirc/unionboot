// W062: Strict boolean request query / scenario 2
// archived; default false
// Read prompts/W062.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W062 {

 public static IResult Handle(HttpRequest request) {
  if(!request.Query.TryGetValue("archived",out var values))return Results.Ok(new { value=false });if(values.Count!=1||!bool.TryParse(values[0],out var value))return Results.BadRequest(new { error="invalid-boolean" });return Results.Ok(new {value});
 }
}
