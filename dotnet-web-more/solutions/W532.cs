// W532: Request culture injected providers / Injected culture fallback fr-FR
namespace DotnetWeb;
public static class W532{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"fr-FR":result.Cultures[0].ToString();
}
}
