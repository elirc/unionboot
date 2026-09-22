// W067: Strict boolean request query / scenario 7
// includeClosed; default true
// Read prompts/W067.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W067 {

 public static IResult Handle(HttpRequest request) {
  if(!request.Query.TryGetValue("includeClosed",out var values))return Results.Ok(new { value=true });if(values.Count!=1||!bool.TryParse(values[0],out var value))return Results.BadRequest(new { error="invalid-boolean" });return Results.Ok(new {value});
 }
}
