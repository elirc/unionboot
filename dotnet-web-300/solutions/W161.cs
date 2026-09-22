// W161: Response header middleware / scenario 1
// X-Exercise-1=web-1; overwrite before next
// Read prompts/W161.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W161 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-1"]="web-1";await next(context);};
 }
}
