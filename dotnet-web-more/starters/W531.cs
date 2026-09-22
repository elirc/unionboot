// W531: Request culture injected providers / Injected culture fallback en-US
namespace DotnetWeb;
public static class W531{

public static Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){throw new NotImplementedException("W531");}
}
