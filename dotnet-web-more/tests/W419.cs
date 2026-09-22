using static DotnetWeb.W419;
namespace DotnetWeb;
public static class TestsW419{public static async Task Run(){await Task.CompletedTask;
{
var c=new OutputCacheContext{HttpContext=Check.Context()};c.HttpContext.Request.Method="GET";c.HttpContext.Request.Path="/public";var policy=Create();await policy.CacheRequestAsync(c,default);Check.True(c.EnableOutputCaching&&c.AllowCacheLookup&&c.AllowCacheStorage);Check.Equal<TimeSpan?>(TimeSpan.FromSeconds(135),c.ResponseExpirationTimeSpan);await policy.ServeFromCacheAsync(c,default);await policy.ServeResponseAsync(c,default);
}
{
foreach(var reason in new[]{"POST","AUTH","PRIVATE"}){var c=new OutputCacheContext{HttpContext=Check.Context()};c.HttpContext.Request.Method=reason=="POST"?"POST":"GET";if(reason=="AUTH")c.HttpContext.Request.Headers["Authorization"]="Bearer demo";if(reason=="PRIVATE")c.HttpContext.Request.Path="/private/data";await Create().CacheRequestAsync(c,default);Check.True(!c.EnableOutputCaching&&!c.AllowCacheLookup&&!c.AllowCacheStorage);}
}
}}
