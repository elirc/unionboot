// W165: Response header middleware / scenario 5
// X-Exercise-5=web-5; overwrite before next
// Read prompts/W165.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W165 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-5"]="web-5";await next(context);};
 }
}
