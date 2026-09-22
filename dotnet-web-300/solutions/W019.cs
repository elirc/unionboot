// W019: Creation and Location contracts / scenario 9
// folders; trimmed title length 1..20
// Read prompts/W019.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W019 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>20||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/folders/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
