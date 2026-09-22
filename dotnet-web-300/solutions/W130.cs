// W130: Route value parsing handlers / scenario 10
// draftId; positive invariant route integer
// Read prompts/W130.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W130 {

 public static IResult Handle(HttpContext context) {
  if(!context.Request.RouteValues.TryGetValue("draftId",out var raw)||raw is not string text||!int.TryParse(text,NumberStyles.None,CultureInfo.InvariantCulture,out var id)||id<1)return Results.BadRequest();return Results.Ok(new {id});
 }
}
