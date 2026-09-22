// W534: Request culture injected providers / Injected culture fallback es-ES
namespace DotnetWeb;
public static class W534{

public static Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){throw new NotImplementedException("W534");}
}
