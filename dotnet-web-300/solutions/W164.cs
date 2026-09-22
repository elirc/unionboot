// W164: Response header middleware / scenario 4
// X-Exercise-4=web-4; overwrite before next
// Read prompts/W164.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W164 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-4"]="web-4";await next(context);};
 }
}
