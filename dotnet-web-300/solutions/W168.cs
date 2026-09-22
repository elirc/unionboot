// W168: Response header middleware / scenario 8
// X-Exercise-8=web-8; overwrite before next
// Read prompts/W168.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W168 {

 public static RequestDelegate Wrap(RequestDelegate next) {
  ArgumentNullException.ThrowIfNull(next);return async context=>{context.Response.Headers["X-Exercise-8"]="web-8";await next(context);};
 }
}
