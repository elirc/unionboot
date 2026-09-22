// W096: JSON media type gates / scenario 6
// JSON-only; declared body limit 144 bytes
// Read prompts/W096.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W096 {

 public static IResult Handle(HttpRequest request) {
  if(!request.HasJsonContentType())return Results.StatusCode(415);if(request.ContentLength is > 144)return Results.StatusCode(413);return Results.Accepted(value:new { accepted=true });
 }
}
