// W093: JSON media type gates / scenario 3
// JSON-only; declared body limit 96 bytes
// Read prompts/W093.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W093 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 96)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
