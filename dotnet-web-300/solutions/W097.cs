// W097: JSON media type gates / scenario 7
// JSON-only; declared body limit 160 bytes
// Read prompts/W097.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W097 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 160)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
