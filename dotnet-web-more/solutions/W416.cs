// W416: Output cache policy objects / Public GET policy TTL 90 seconds
namespace DotnetWeb;
public static class W416{

public static IOutputCachePolicy Create(){
return new DelegateCachePolicy(c=>{bool allowed=HttpMethods.IsGet(c.HttpContext.Request.Method)&&!c.HttpContext.Request.Headers.ContainsKey("Authorization")&&!c.HttpContext.Request.Path.StartsWithSegments("/private");c.EnableOutputCaching=allowed;c.AllowCacheLookup=allowed;c.AllowCacheStorage=allowed;c.ResponseExpirationTimeSpan=TimeSpan.FromSeconds(90);});
}
}
