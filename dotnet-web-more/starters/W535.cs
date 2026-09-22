// W535: Request culture injected providers / Injected culture fallback ja-JP
namespace DotnetWeb;
public static class W535{

public static Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){throw new NotImplementedException("W535");}
}
