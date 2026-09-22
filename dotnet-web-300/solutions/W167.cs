// W167: Response header middleware / scenario 7
// X-Exercise-7=web-7; overwrite before next
// Read prompts/W167.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W167 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-7"]="web-7";await next(context);};
 }
}
