// W534: Request culture injected providers / Injected culture fallback es-ES
namespace DotnetWeb;
public static class W534{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"es-ES":result.Cultures[0].ToString();
}
}
