// W020: Creation and Location contracts / scenario 10
// lists; trimmed title length 1..21
// Read prompts/W020.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W020 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>21||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/lists/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
