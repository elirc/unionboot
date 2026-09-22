// W012: Creation and Location contracts / scenario 2
// tickets; trimmed title length 1..13
// Read prompts/W012.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W012 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>13||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/tickets/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
