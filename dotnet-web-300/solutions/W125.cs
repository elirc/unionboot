// W125: Route value parsing handlers / scenario 5
// teamId; positive invariant route integer
// Read prompts/W125.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W125 {

 public static IResult Handle(HttpContext context) {
  if(!context.Request.RouteValues.TryGetValue("teamId",out var raw)||raw is not string text||!int.TryParse(text,NumberStyles.None,CultureInfo.InvariantCulture,out var id)||id<1)return Results.BadRequest();return Results.Ok(new {id});
 }
}
