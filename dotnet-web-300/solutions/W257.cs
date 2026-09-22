// W257: Conditional GET ETags / scenario 7
// Representation v7; weak If-None-Match comparison
// Read prompts/W257.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W257 {

 public static IResult Handle(HttpContext context) {
  const string etag="\"v7\"";context.Response.Headers.ETag=etag;var raw=context.Request.Headers.IfNoneMatch.ToString();var matches=raw.Split(',').Select(s=>s.Trim()).Any(s=>s=="*"||s==etag||s=="W/"+etag);return matches?Results.StatusCode(304):Results.Ok(new {version=7});
 }
}
