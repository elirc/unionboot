// W254: Conditional GET ETags / scenario 4
// Representation v4; weak If-None-Match comparison
// Read prompts/W254.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W254 {

 public static IResult Handle(HttpContext context) {
  const string etag="\"v4\"";context.Response.Headers.ETag=etag;var raw=context.Request.Headers.IfNoneMatch.ToString();var matches=raw.Split(',').Select(s=>s.Trim()).Any(s=>s=="*"||s==etag||s=="W/"+etag);return matches?Results.StatusCode(304):Results.Ok(new {version=4});
 }
}
