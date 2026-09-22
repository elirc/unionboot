// W255: Conditional GET ETags / scenario 5
// Representation v5; weak If-None-Match comparison
// Read prompts/W255.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W255 {

 public static IResult Handle(HttpContext context) {
  const string etag="\"v5\"";context.Response.Headers.ETag=etag;var raw=context.Request.Headers.IfNoneMatch.ToString();var matches=raw.Split(',').Select(s=>s.Trim()).Any(s=>s=="*"||s==etag||s=="W/"+etag);return matches?Results.StatusCode(304):Results.Ok(new {version=5});
 }
}
