// W418: Output cache policy objects / Public GET policy TTL 120 seconds
namespace DotnetWeb;
public static class W418{

public static IOutputCachePolicy Create(){
return new DelegateCachePolicy(c=>{bool allowed=HttpMethods.IsGet(c.HttpContext.Request.Method)&&!c.HttpContext.Request.Headers.ContainsKey("Authorization")&&!c.HttpContext.Request.Path.StartsWithSegments("/private");c.EnableOutputCaching=allowed;c.AllowCacheLookup=allowed;c.AllowCacheStorage=allowed;c.ResponseExpirationTimeSpan=TimeSpan.FromSeconds(120);});
}
}
