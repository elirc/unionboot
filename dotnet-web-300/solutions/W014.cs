// W014: Creation and Location contracts / scenario 4
// drafts; trimmed title length 1..15
// Read prompts/W014.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W014 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>15||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/drafts/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
