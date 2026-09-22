// W235: Current principal response projection / scenario 5
// Authenticated operator_id projection only
// Read prompts/W235.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W235 {

 public static IResult Handle(ClaimsPrincipal user) {
  if(user.Identity?.IsAuthenticated!=true)return Results.Unauthorized();var values=user.FindAll("operator_id").Select(c=>c.Value).ToArray();if(values.Length!=1||string.IsNullOrWhiteSpace(values[0]))return Results.StatusCode(403);return Results.Ok(new {id=values[0]});
 }
}
