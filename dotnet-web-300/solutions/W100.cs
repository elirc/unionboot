// W100: JSON media type gates / scenario 10
// JSON-only; declared body limit 208 bytes
// Read prompts/W100.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W100 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 208)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
