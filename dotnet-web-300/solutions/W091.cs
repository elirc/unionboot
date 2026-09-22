// W091: JSON media type gates / scenario 1
// JSON-only; declared body limit 64 bytes
// Read prompts/W091.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W091 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 64)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
