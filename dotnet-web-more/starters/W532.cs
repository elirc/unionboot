// W532: Request culture injected providers / Injected culture fallback fr-FR
namespace DotnetWeb;
public static class W532{

public static Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){throw new NotImplementedException("W532");}
}
