// W238: Current principal response projection / scenario 8
// Authenticated staff_id projection only
// Read prompts/W238.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W238 {

 public static IResult Handle(ClaimsPrincipal user) {
  if(user.Identity?.IsAuthenticated!=true)return Results.Unauthorized();var values=user.FindAll("staff_id").Select(c=>c.Value).ToArray();if(values.Length!=1||string.IsNullOrWhiteSpace(values[0]))return Results.StatusCode(403);return Results.Ok(new {id=values[0]});
 }
}
