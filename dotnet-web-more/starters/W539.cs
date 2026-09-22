// W539: Request culture injected providers / Injected culture fallback nl-NL
namespace DotnetWeb;
public static class W539{

public static Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){throw new NotImplementedException("W539");}
}
