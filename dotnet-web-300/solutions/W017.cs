// W017: Creation and Location contracts / scenario 7
// teams; trimmed title length 1..18
// Read prompts/W017.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W017 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>18||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/teams/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
