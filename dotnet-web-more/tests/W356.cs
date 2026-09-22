using static DotnetWeb.W356;
namespace DotnetWeb;
public static class TestsW356{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("teams","/teams/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v6/teams/7",Resolve(gen,7));Check.Equal("/v6/teams/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
