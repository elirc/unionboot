// W102: JSON request body validation / scenario 2
// Body {count}; integer range 0..4
// Read prompts/W102.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W102 {

 public static async Task<IResult> Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);try{using var doc=await JsonDocument.ParseAsync(request.Body,cancellationToken:request.HttpContext.RequestAborted);var root=doc.RootElement;if(root.ValueKind!=JsonValueKind.Object||!root.TryGetProperty("count",out var value)||!value.TryGetInt32Safe(out var count)||count<0||count>4)return Results.BadRequest();return Results.Ok(new {count});}catch(JsonException){return Results.BadRequest();}
 }
}
