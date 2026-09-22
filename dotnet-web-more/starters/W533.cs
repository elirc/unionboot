// W533: Request culture injected providers / Injected culture fallback de-DE
namespace DotnetWeb;
public static class W533{

public static Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){throw new NotImplementedException("W533");}
}
