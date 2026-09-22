// W169: Response header middleware / scenario 9
// X-Exercise-9=web-9; overwrite before next
// Read prompts/W169.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W169 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-9"]="web-9";await next(context);};
 }
}
