// W540: Request culture injected providers / Injected culture fallback sv-SE
namespace DotnetWeb;
public static class W540{

public static Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){throw new NotImplementedException("W540");}
}
