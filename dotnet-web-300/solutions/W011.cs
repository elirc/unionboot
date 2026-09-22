// W011: Creation and Location contracts / scenario 1
// orders; trimmed title length 1..12
// Read prompts/W011.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W011 {

 public static IResult Handle(string? title, int assignedId) {
  var name=title?.Trim(); if(string.IsNullOrEmpty(name)||name.Length>12||assignedId<=0)return Results.BadRequest(new { error="invalid-create" }); return Results.Created("/orders/"+assignedId.ToString(CultureInfo.InvariantCulture),new { id=assignedId,title=name });
 }
}
