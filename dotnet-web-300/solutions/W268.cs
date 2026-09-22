// W268: Cache policy response middleware / scenario 8
// Public max-age 120; authenticated no-store
// Read prompts/W268.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W268 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers.CacheControl=context.User.Identity?.IsAuthenticated==true?"no-store":"public, max-age=120";var existing=context.Response.Headers.Vary.ToString().Split(',').Select(x=>x.Trim()).Where(x=>x.Length>0).ToList();if(!existing.Contains("Accept",StringComparer.OrdinalIgnoreCase)&&!existing.Contains("*"))existing.Add("Accept");context.Response.Headers.Vary=string.Join(", ",existing);await next(context);};
 }
}
