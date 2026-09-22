// W538: Request culture injected providers / Injected culture fallback pt-BR
namespace DotnetWeb;
public static class W538{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"pt-BR":result.Cultures[0].ToString();
}
}
