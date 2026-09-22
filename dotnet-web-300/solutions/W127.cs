// W127: Route value parsing handlers / scenario 7
// fileId; positive invariant route integer
// Read prompts/W127.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W127 {

 public static IResult Handle(HttpContext context) {
  if(!context.Request.RouteValues.TryGetValue("fileId",out var raw)||raw is not string text||!int.TryParse(text,NumberStyles.None,CultureInfo.InvariantCulture,out var id)||id<1)return Results.BadRequest();return Results.Ok(new {id});
 }
}
