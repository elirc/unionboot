// W066: Strict boolean request query / scenario 6
// draft; default false
// Read prompts/W066.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W066 {

 public static IResult Handle(HttpRequest request) {
  if(!request.Query.TryGetValue("draft",out var values))return Results.Ok(new { value=false });if(values.Count!=1||!bool.TryParse(values[0],out var value))return Results.BadRequest(new { error="invalid-boolean" });return Results.Ok(new {value});
 }
}
