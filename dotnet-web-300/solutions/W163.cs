// W163: Response header middleware / scenario 3
// X-Exercise-3=web-3; overwrite before next
// Read prompts/W163.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W163 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-3"]="web-3";await next(context);};
 }
}
