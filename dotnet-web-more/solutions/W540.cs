// W540: Request culture injected providers / Injected culture fallback sv-SE
namespace DotnetWeb;
public static class W540{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"sv-SE":result.Cultures[0].ToString();
}
}
