// W119: Form body handling / scenario 9
// Urlencoded nickname max 16
// Read prompts/W119.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W119 {

 public static async Task<IResult> Handle(HttpRequest request) {
  if(!request.HasFormContentType)return Results.StatusCode(415);var form=await request.ReadFormAsync(request.HttpContext.RequestAborted);var values=form["nickname"];if(values.Count!=1||string.IsNullOrWhiteSpace(values[0])||values[0]!.Trim().Length>16)return Results.BadRequest();return Results.Ok(new { nickname=values[0]!.Trim() });
 }
}
