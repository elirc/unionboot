// W253: Conditional GET ETags / scenario 3
// Representation v3; weak If-None-Match comparison
// Read prompts/W253.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W253 {

 public static IResult Handle(HttpContext context) {
  const string etag="\"v3\"";context.Response.Headers.ETag=etag;var raw=context.Request.Headers.IfNoneMatch.ToString();var matches=raw.Split(',').Select(s=>s.Trim()).Any(s=>s=="*"||s==etag||s=="W/"+etag);return matches?Results.StatusCode(304):Results.Ok(new {version=3});
 }
}
