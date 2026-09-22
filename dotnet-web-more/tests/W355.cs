using static DotnetWeb.W355;
namespace DotnetWeb;
public static class TestsW355{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("files","/files/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v5/files/7",Resolve(gen,7));Check.Equal("/v5/files/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
