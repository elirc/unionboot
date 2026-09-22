// W094: JSON media type gates / scenario 4
// JSON-only; declared body limit 112 bytes
// Read prompts/W094.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W094 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 112)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
