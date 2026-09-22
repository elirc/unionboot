// W537: Request culture injected providers / Injected culture fallback it-IT
namespace DotnetWeb;
public static class W537{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"it-IT":result.Cultures[0].ToString();
}
}
