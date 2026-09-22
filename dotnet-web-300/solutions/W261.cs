// W261: Cache policy response middleware / scenario 1
// Public max-age 15; authenticated no-store
// Read prompts/W261.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W261 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers.CacheControl=context.User.Identity?.IsAuthenticated==true?"no-store":"public, max-age=15";var existing=context.Response.Headers.Vary.ToString().Split(',').Select(x=>x.Trim()).Where(x=>x.Length>0).ToList();if(!existing.Contains("Accept",StringComparer.OrdinalIgnoreCase)&&!existing.Contains("*"))existing.Add("Accept");context.Response.Headers.Vary=string.Join(", ",existing);await next(context);};
 }
}
