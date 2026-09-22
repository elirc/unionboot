// W064: Strict boolean request query / scenario 4
// compact; default false
// Read prompts/W064.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W064 {

 public static IResult Handle(HttpRequest request) {
  if(!request.Query.TryGetValue("compact",out var values))return Results.Ok(new { value=false });if(values.Count!=1||!bool.TryParse(values[0],out var value))return Results.BadRequest(new { error="invalid-boolean" });return Results.Ok(new {value});
 }
}
