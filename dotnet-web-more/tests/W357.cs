using static DotnetWeb.W357;
namespace DotnetWeb;
public static class TestsW357{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("tags","/tags/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v7/tags/7",Resolve(gen,7));Check.Equal("/v7/tags/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
