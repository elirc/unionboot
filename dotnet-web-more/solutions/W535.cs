// W535: Request culture injected providers / Injected culture fallback ja-JP
namespace DotnetWeb;
public static class W535{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"ja-JP":result.Cultures[0].ToString();
}
}
