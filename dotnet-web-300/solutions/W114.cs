// W114: Form body handling / scenario 4
// Urlencoded nickname max 11
// Read prompts/W114.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W114 {

 public static async Task<IResult> Handle(HttpRequest request) {
  if(!request.HasFormContentType)return Results.StatusCode(415);var form=await request.ReadFormAsync(request.HttpContext.RequestAborted);var values=form["nickname"];if(values.Count!=1||string.IsNullOrWhiteSpace(values[0])||values[0]!.Trim().Length>11)return Results.BadRequest();return Results.Ok(new { nickname=values[0]!.Trim() });
 }
}
