// W095: JSON media type gates / scenario 5
// JSON-only; declared body limit 128 bytes
// Read prompts/W095.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W095 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 128)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
