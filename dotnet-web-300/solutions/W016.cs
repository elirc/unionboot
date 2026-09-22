// W016: Creation and Location contracts / scenario 6
// labels; trimmed title length 1..17
// Read prompts/W016.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W016 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>17||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/labels/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
