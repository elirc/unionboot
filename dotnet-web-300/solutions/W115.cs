// W115: Form body handling / scenario 5
// Urlencoded nickname max 12
// Read prompts/W115.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W115 {

 public static async Task<IResult> Handle(HttpRequest request) {
  if(!request.HasFormContentType)return Results.StatusCode(415);var form=await request.ReadFormAsync(request.HttpContext.RequestAborted);var values=form["nickname"];if(values.Count!=1||string.IsNullOrWhiteSpace(values[0])||values[0]!.Trim().Length>12)return Results.BadRequest();return Results.Ok(new { nickname=values[0]!.Trim() });
 }
}
