// W239: Current principal response projection / scenario 9
// Authenticated agent_id projection only
// Read prompts/W239.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W239 {

 public static IResult Handle(ClaimsPrincipal user) {
  if(user.Identity?.IsAuthenticated!=true)return Results.Unauthorized();var values=user.FindAll("agent_id").Select(c=>c.Value).ToArray();if(values.Length!=1||string.IsNullOrWhiteSpace(values[0]))return Results.StatusCode(403);return Results.Ok(new {id=values[0]});
 }
}
