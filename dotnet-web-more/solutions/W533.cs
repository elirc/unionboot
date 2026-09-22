// W533: Request culture injected providers / Injected culture fallback de-DE
namespace DotnetWeb;
public static class W533{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"de-DE":result.Cultures[0].ToString();
}
}
