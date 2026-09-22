// W536: Request culture injected providers / Injected culture fallback ko-KR
namespace DotnetWeb;
public static class W536{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"ko-KR":result.Cultures[0].ToString();
}
}
