// W162: Response header middleware / scenario 2
// X-Exercise-2=web-2; overwrite before next
// Read prompts/W162.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W162 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-2"]="web-2";await next(context);};
 }
}
