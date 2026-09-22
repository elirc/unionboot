// W539: Request culture injected providers / Injected culture fallback nl-NL
namespace DotnetWeb;
public static class W539{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"nl-NL":result.Cultures[0].ToString();
}
}
