// W170: Response header middleware / scenario 10
// X-Exercise-10=web-10; overwrite before next
// Read prompts/W170.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W170 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-10"]="web-10";await next(context);};
 }
}
