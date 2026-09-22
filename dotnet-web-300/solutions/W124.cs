// W124: Route value parsing handlers / scenario 4
// noteId; positive invariant route integer
// Read prompts/W124.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W124 {

 public static IResult Handle(HttpContext context) {
  if(!context.Request.RouteValues.TryGetValue("noteId",out var raw)||raw is not string text||!int.TryParse(text,NumberStyles.None,CultureInfo.InvariantCulture,out var id)||id<1)return Results.BadRequest();return Results.Ok(new {id});
 }
}
