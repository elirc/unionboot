// W231: Current principal response projection / scenario 1
// Authenticated sub projection only
// Read prompts/W231.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W231 {

 public static IResult Handle(ClaimsPrincipal user) {
  if(user.Identity?.IsAuthenticated!=true)return Results.Unauthorized();var values=user.FindAll("sub").Select(c=>c.Value).ToArray();if(values.Length!=1||string.IsNullOrWhiteSpace(values[0]))return Results.StatusCode(403);return Results.Ok(new {id=values[0]});
 }
}
