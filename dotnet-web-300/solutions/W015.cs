// W015: Creation and Location contracts / scenario 5
// tasks; trimmed title length 1..16
// Read prompts/W015.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W015 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>16||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/tasks/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
