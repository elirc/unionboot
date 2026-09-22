// W092: JSON media type gates / scenario 2
// JSON-only; declared body limit 80 bytes
// Read prompts/W092.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W092 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 80)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
