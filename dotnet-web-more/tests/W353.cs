using static DotnetWeb.W353;
namespace DotnetWeb;
public static class TestsW353{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("users","/users/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v3/users/7",Resolve(gen,7));Check.Equal("/v3/users/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
