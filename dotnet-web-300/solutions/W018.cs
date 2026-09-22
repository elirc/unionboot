// W018: Creation and Location contracts / scenario 8
// boards; trimmed title length 1..19
// Read prompts/W018.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W018 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>19||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/boards/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
