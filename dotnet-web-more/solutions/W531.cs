// W531: Request culture injected providers / Injected culture fallback en-US
namespace DotnetWeb;
public static class W531{

public static async Task<string> Resolve(HttpContext context,IRequestCultureProvider provider){
var result=await provider.DetermineProviderCultureResult(context);return result is null||result.Cultures.Count==0?"en-US":result.Cultures[0].ToString();
}
}
