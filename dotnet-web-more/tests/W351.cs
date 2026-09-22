using static DotnetWeb.W351;
namespace DotnetWeb;
public static class TestsW351{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("widgets","/widgets/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v1/widgets/7",Resolve(gen,7));Check.Equal("/v1/widgets/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
