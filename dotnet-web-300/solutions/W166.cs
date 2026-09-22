// W166: Response header middleware / scenario 6
// X-Exercise-6=web-6; overwrite before next
// Read prompts/W166.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W166 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-6"]="web-6";await next(context);};
 }
}
