// W098: JSON media type gates / scenario 8
// JSON-only; declared body limit 176 bytes
// Read prompts/W098.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W098 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 176)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
