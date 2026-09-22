// W013: Creation and Location contracts / scenario 3
// notes; trimmed title length 1..14
// Read prompts/W013.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W013 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>14||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/notes/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
