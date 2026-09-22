// W068: Strict boolean request query / scenario 8
// summary; default false
// Read prompts/W068.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W068 {

 public static IResult Handle(HttpRequest request) {
  if(!request.Query.TryGetValue("summary",out var values))return Results.Ok(new { value=false });if(values.Count!=1||!bool.TryParse(values[0],out var value))return Results.BadRequest(new { error="invalid-boolean" });return Results.Ok(new {value});
 }
}
